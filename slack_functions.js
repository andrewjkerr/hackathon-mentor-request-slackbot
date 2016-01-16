/*
 *   slack_functions.js
 *     this file contains implementations of the basic Slack functions
 */

var utils = require('./utils.js');
var CoffeeScript = require('coffee-script');
var slack_client = require('slack-client');

exports.init = function(api_token) {
  // init new instance of the slack real time client
  var slack = new slack_client(api_token);

  slack.on('open', function() {
    console.log(bot_name + ' is online, listening for ' + bot_trigger + ' ...');
    connected = true;
  });

  return slack;
}

// send a message to the specified channel/group/whatever
// "where" needs to be a channel/group/dm object
exports.say = function (with_what, where) {
  // first send typing indicator
  where.sendMessage({"type": "typing"});

  // ok now send the actual message in a little while
  // this fuzziness makes the bot seem almost human
  setTimeout(function() {
    where.sendMessage({'type': 'message', 'text': with_what, 'link_names': 1, 'parse': 'full'});
  }, utils.getRandomInt(500, 1200));
}
