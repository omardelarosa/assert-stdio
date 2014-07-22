var exec = require('child_process').exec
var q = require('q')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var AssertionError = require('./errors').AssertionError
var ContainsError = require('./errors').ContainsError

function compare(actual, expected) {
  return actual === expected;
}

function Assertion (opts) {
  var self = this;

  // validations
  if (!opts.command || typeof opts.command !== "string") {
    throw new Error("'command' must be a string!")
  }

  if (opts.args && opts.args.constructor !== Array ) {
    throw new Error("'args' must be null or an array")
  }

  if (opts.expected && typeof opts.expected !== "string") {
    throw new Error("'expected output' must 'null' or a string!")
  }

  var concat = opts.command
  this.command = opts.command
  this.args = opts.args || [];
  this.expected = opts.expected || null;
  this.using = opts.using;
  this.opts = opts;
  this.chunks = [];
  concat += " ";
  concat += this.args.join(" ");
  this.concat = concat;
  // aliases for chaining
  this.to = this;
  this.and = this;
  this.should = this;

  // callback
  this.notify = function(cb){ return cb(); }

}

util.inherits(Assertion, EventEmitter)

Assertion.prototype.init = function () {
  var self = this;
  child = exec(this.concat, Assertion.childProcessCallback.bind(this))
  this.child = child;

  this.child.stdout.on("data", function(chunk){
    console.log("chunk", chunk)
    self.chunks.push(chunk.toString('utf8'));
  })
  return this;
}

Assertion.prototype.send = function (msg) {
  this.child.stdin.write(msg)
  return this;
}

Assertion.prototype.end = function(){
  this.child.stdin.end();
  return this;
}

  // a wrapper for setTimeout
Assertion.prototype.in = function(ms, cb) {
  setTimeout(cb.bind(this), ms)
  return this;
}

Assertion.childProcessCallback = function (err, stdout, stderr) {
  if (err) {
      this.emit("end");
    }
    this.chunks.push(stdout.toString())
  // compare only if "expected" was passed in
  if (this.expected) {
    if (stdout === this.expected) {
      this.emit("end");
    } else {
      this.error = new AssertionError(stdout, this.expected)
      this.emit("error", this.error);
    }
  } else {
    
  }
}

Assertion.prototype.equal = function equal(expected){
  var actual = this.child.stdout.toString()
  console.log("expected: '%s', out: '%s'", expected, actual)
  if (actual == expected) {
  } else {
    throw new AssertionError(actual.toString(), expected)
  }
}

Assertion.prototype.contain = function equal(expected){
  var actual = this.chunks[0]
  if ( actual.search(expected) > -1 ) {
    return self;
  } else {
    throw new ContainsError(actual, expected)
  }
}

module.exports = Assertion;