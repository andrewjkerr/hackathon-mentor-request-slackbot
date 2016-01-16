/*

    testbot. whoa.
    now with 100% more Tumblrn magic.

*/

// coffeescript is needed for the slack-client lib
var CoffeeScript = require('coffee-script');

// the offical slack client lib
var slack_client = require('slack-client');

// basic utils
var utils = require('./utils.js');

// basic Slack functions
var slack_functions = require('./slack_functions.js');

// check for a config file when calling this script, we need it
if (process.argv.length < 3 || process.argv[2] == undefined) {
  console.log('Slackbot requires a config file passed to it, please see README.');
  process.exit(1);
}

// load bot config
console.log('requiring config in file: ' + process.argv[2]);
var file_name = process.argv[2];
if (file_name.lastIndexOf('/', 0)  === 0) {
  var config_file = file_name;
} else {
  var config_file = './' + process.argv[2];
}

var config = require(config_file);

// primary bot config
var bot_name = config.bot_name;
var bot_trigger = config.bot_trigger;
var teams = config.teams;

// TO-DO: Make this automatically generated
var available = config.mentors;

// init new instance of the slack real time client
var slack = new slack_client(config.api_token);

slack.on('open', function() {
  console.log(bot_name + ' is online, listening for ' + bot_trigger + ' ...');
  connected = true;
});

slack.on('message', function(message) {

  if (message.type == 'message') {
    // if there is no user, then it's probably not something we need to worry about
    if (message.user == undefined) {
      return;
    }

    // send the incoming message off to be parsed + responded to
    handle_message(message);
  } else {
    return; // do nothing with other types of messages for now
  }
});

// add a trim() method for strings
String.prototype.trim = function() { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

function strip_trigger(text) {
  return strip_text(text, bot_trigger);
}

function strip_text(text, to_strip) {
  return text.replace(to_strip + ' ', '');
}

// handle an incoming message object
function handle_message(message_obj) {
  var chatline = message_obj.text.trim();

  if (chatline.lastIndexOf(bot_trigger, 0)  === 0) {
    process_team_message(strip_trigger(chatline), message_obj);
  }

}

function process_team_message(team, message_obj) {

  // where did this message come from??
  var where = slack.getChannelGroupOrDMByID(message_obj.channel);

  // who did this message come from??
  var from = slack.getUserByID(message_obj.user)

  if (team.lastIndexOf('keywords', 0) === 0) {
    list_keywords(where);
  } else if (team.lastIndexOf('available', 0) === 0) {
    list_available_mentors(where);
  } else if (team.lastIndexOf('done', 0) === 0) {
    finish_mentoring(from, where);
  } else if (team === bot_trigger) {
    display_help(where, from);
  } else {
    mentor_request(team, where, from);
  }
}

function list_keywords(where) {
  slack_functions.say('The following keywords are available: ' + Object.keys(teams).join(', ') + '. Don\'t see what you need here? Just use `ALL` as a keyword.', where);
}

function list_available_mentors(where) {
  slack_functions.say('The following mentors are available: ' + available.join(', ') + '.', where);
}

function display_help(where, from) {
  slack_functions.say('Hey @' + from.name + '! Here are a list of commands: \'keywords\' and \'available\'. When you\'re ready, use `.mentor {keyword} {issue}` to open a new mentor request.', where);
}

function mentor_request(text, where, from) {
  if (available.length == 0) {
    slack_functions.say('Sorry, but no one is available at the moment. Please check back later!', where);
    return;
  }

  text_arr = text.split(' ');
  keyword = text_arr.shift();
  issue = text_arr.join(' ');

  if (keyword.toUpperCase() === 'ALL') {
    var assigned = available[0];
    assign_mentor(assigned, from, keyword, issue, where);
  } else {
    if (keyword in teams) {
      var assigned = false;
      // What is this?!
      var BreakException= {};
      try {
        teams[keyword].forEach(function(entry) {
          if (available.indexOf(entry) != -1) {
            assigned = entry;
            throw BreakException;
          }
        });
      } catch(e) {
        if (e !== BreakException) {
          throw e;
        }
      }

      if (assigned === false) {
        slack_functions.say('Sorry, but no one is available to help you for that keyword! But, do not fret. We\'ll get someone else right on it.', where);
        assigned = available[0];
      }

      assign_mentor(assigned, from, keyword, issue, where);
    } else {
      slack_functions.say('I don\'t know that keyword! Please use one of the specific keywords or `ALL` if none of the keywords apply to you.', where);
    }
  }
}

function assign_mentor(assigned_mentor, assigned_to_obj, keyword, issue, where) {
  assigned_mentor_obj = slack.getUserByName(assigned_mentor);
  if (!assigned_mentor_obj) {
    slack_functions.say('That mentor doesn\'t exist!', where);
  } else {
    group_name = utils.generateChannelName(assigned_to_obj, keyword);
    slack.createGroup(group_name, function(assigned_mentor_obj, assigned_to_obj){
      // Currently borked? Dunno why.
      group_obj = slack.getChannelGroupOrDMByName(group_name);
      invite_user(assigned_mentor_obj, group_obj);
      invite_user(assigned_to_obj, group_obj);
    });

    slack_functions.say('Ok, @' + assigned_mentor_obj.name + ' you\'re up! Make sure to `.mentor done` when you are done.', where);
    var index = available.indexOf(assigned_mentor);
    if (index > -1) {
        available.splice(index, 1);
    }
  }
}

function invite_user(user, where) {
  where.invite(user.id);
}

function finish_mentoring(user_obj, where) {
  available.push(user_obj.name);
  slack_functions.say('Thanks! The follow mentors are now available: ' + available.join(', ') + '.', where);
}

function process_member_add(text, where) {
  text = strip_text(text, 'add');
  text_arr = text.split(' ');
  team = text_arr[0];
  member = text_arr[1];
  add_member(team, member, where);
}

function add_member(team, member, where) {
  user = slack.getUserByName(text_arr[1]);

  if (user) {
    if (team[team]) {
      teams[team].push(member);
    } else {
      teams[team] = [member];
    }

    slack_functions.say(member + ' was successfully added to ' + team + '!', where);
  } else {
    slack_functions.say('That user doesn\'t exist!', where);
  }
}

// actually log in and connect!
slack.login();
