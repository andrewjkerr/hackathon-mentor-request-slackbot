exports.config_check = function () {
  // check for a config file when calling this script, we need it
  if (process.argv.length < 3 || process.argv[2] == undefined) {
    console.log('Slackbot requires a config file passed to it, please see README.');
    process.exit(1);
  }
}

exports.config_arg_parse = function () {
  // load bot config
  console.log('requiring config in file: ' + process.argv[2]);
  var file_name = process.argv[2];
  if (file_name.lastIndexOf('/', 0)  === 0) {
    return file_name;
  } else {
    return './' + process.argv[2];
  }
}
