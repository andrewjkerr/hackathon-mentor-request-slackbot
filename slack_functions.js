/*
 *   slack_functions.js
 *     this file contains implementations of the basic Slack functions
 */

// basic utils
var utils = require('./utils.js');

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
