var exec = require('child_process').exec
var q = require('q')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var AssertionError = require('./errors')

function Assertion (opts) {
  var self = this;

  // validations
  if (!opts.command || typeof opts.command !== "string") {
    throw new Error("'command' must be a string!")
  }

  if (opts.args && opts.args.constructor !== Array ) {
    throw new Error("'args' must be null or an array")
  }

  if (!opts.expected || typeof opts.expected !== "string") {
    throw new Error("'expected output' must be a string!")
  }

  var concat = opts.command
  this.args = opts.args || [];
  this.expected = opts.expected
  this.using = opts.using;
  this.opts = opts;
  concat += " ";
  concat += this.args.join(" ");

  child = exec(concat, Assertion.childProcessCallback.bind(this))
  this.child = child;

  this.send = function (msg) {
    self.child.stdin.write(msg)
    return self;
  }

  this.end = function(){
    self.child.stdin.end();
    return self;
  }

  // a wrapper for setTimeout
  this.in = function(ms, cb) {
    setTimeout(cb.bind(self), ms)
    return self;
  }

}

Assertion.childProcessCallback = function (err, stdout, stderr) {
  if (err) {
    throw err;
  } 
  // compare using strict operator
  if (stdout !== this.expected) {
    console.log("stdout", stdout)
    throw new AssertionError(stdout, this.expected)
  }
}


module.exports = Assertion;