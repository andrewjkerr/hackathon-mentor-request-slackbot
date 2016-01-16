/*

    testbot. whoa.
    now with 100% more Tumblrn magic.

*/

// oops
var config_functions = require('./config_functions.js');
var utils = require('./utils.js');
var slack_functions = require('./slack_functions.js');
var bot_functions = require('./bot_functions.js');

config_functions.config_check();
var config_file = config_functions.config_arg_parse();

// Set up variables
var config = require(config_file);

// primary bot config
global.bot_name = config.bot_name;
global.bot_trigger = config.bot_trigger;
global.teams = config.teams;

// TO-DO - make this automatically generated from teams
global.available = config.mentors;

// Dupe mentors to check against later
global.mentors = config.mentors.slice(0);

// Init Slack
global.slack = slack_functions.init(config.api_token);

// Add a message handler
slack.on('message', function(message) {

  if (message.type == 'message') {
    // if there is no user, then it's probably not something we need to worry about
    if (message.user == undefined) {
      return;
    }

    // send the incoming message off to be parsed + responded to
    bot_functions.handle_message(message);
  } else {
    return; // do nothing with other types of messages for now
  }
});

// add a trim() method for strings
String.prototype.trim = function() { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

// actually log in and connect!
slack.login();
