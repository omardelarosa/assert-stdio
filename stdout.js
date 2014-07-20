var exec = require('child_process').exec
var q = require('q')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var AssertionError = require('./errors')
var Assertion = require('./assertion')

function AssertStdout (command, args, expected) {
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
    return new Assertion(opts)

  } else if (Assertion.using() === "promises") {
    dfd = q.defer()
    opts.promise = dfd.promise
    self.promise = opts.promise
    self.dfd = dfd
    opts.dfd = dfd
    Assertion(opts)
    return dfd.promise;
  } else if (Assertion.using() === "events") {
    util.inherits(Assertion, EventEmitter)
    return new Assertion(opts)
  }
}

AssertStdout.use = function (cb) {
  this.Assertion = Assertion;
  cb.call(this)
}



module.exports = AssertStdout;