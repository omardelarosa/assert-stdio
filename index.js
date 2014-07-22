var exec = require('child_process').exec
var q = require('q')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var AssertionError = require('./errors')
var Assertion = require('./assertion')

function AssertStdio (command, args, expected) {
  var self = this
  // console.log("USING", Assertion.using())
  var opts = {
      command: command,
      args: args,
      expected: expected,
      ctx: self,
      using: (!Assertion.using ? null : Assertion.using())
    }

  if (!Assertion.using) {
    var a = new Assertion(opts);
    return a;

  } else if (Assertion.using() === "promises") {
    dfd = q.defer()
    opts.promise = dfd.promise
    self.promise = opts.promise
    self.dfd = dfd
    opts.dfd = dfd
    var a = new Assertion(opts)
    self.promise.and = a;
    return self.promise;
  }
}

AssertStdio.use = function (cb) {
  this.Assertion = Assertion;
  cb.call(this)
}


module.exports = AssertStdio;