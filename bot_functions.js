var utils = require('./utils.js');
var slack_functions = require('./slack_functions.js');

// handle an incoming message object
exports.handle_message = function (message_obj) {
  var chatline = message_obj.text.trim();

  if (chatline.lastIndexOf(bot_trigger, 0)  === 0) {
    process_team_message(utils.strip_text(chatline, bot_trigger), message_obj);
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
    slack_functions.say('Ok, @' + assigned_mentor_obj.name + ' you\'re up! Please DM ' + assigned_to_obj.name + ' and make sure to `.mentor done` when you are done.', where);
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
  if (is_username_mentor(user_obj.name)) {
    if (!is_mentor_is_available(user_obj.name)) {
      available.push(user_obj.name);
      slack_functions.say('Thanks! The follow mentors are now available: ' + available.join(', ') + '.', where);
    } else {
      slack_functions.say('Whoops, you\'re already marked as available!', where);
    }
  } else {
    slack_functions.say('Whoops, you\'re not registered as a mentor!', where);
  }
}

function is_username_mentor(username) {
  return mentors.indexOf(username) != -1;
}

function is_mentor_is_available(username) {
  return available.indexOf(username) != -1;
}
