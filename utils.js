/*
 *   utils.js
 *     this file contains implementations of basic utils used in various places
 */

// get a random integer between range
exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.generateChannelName = function (assigned_to_obj, keyword) {
  return assigned_to_obj.name + '_' + keyword + '_' + Math.random().toString(36).substring(5);
}

exports.strip_text = function (text, to_strip) {
  return text.replace(to_strip + ' ', '');
}
