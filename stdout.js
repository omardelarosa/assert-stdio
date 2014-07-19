var exec = require('child_process').exec
var q = require('q')

function AssertionError (actual, expected) {
  var concat = ["Expected: '", expected,"' to be: '", actual, "'"].join("")
  return Error(concat);
}

function AssertStdout (command, args, expected) {

  var concat = command
    , self = this
    , dfd = q.defer()
    , expected = expected;

  concat += " ";
  concat += args.join(" ");
  
  child = exec(concat, function(err, stdout, stderr){
    if (err) { 
      dfd.reject();
    } 
    if (stdout === expected) {
      dfd.resolve();
    } else {
      dfd.reject(new AssertionError(stdout, expected));
    }
  });

  return dfd.promise;
}

module.exports = AssertStdout;