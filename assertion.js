var exec = require('child_process').exec
var q = require('q')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var AssertionError = require('./errors').AssertionError
var ContainsError = require('./errors').ContainsError

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

  // 'this' aliases for chaining
  this.to = this;
  this.and = this;
  this.should = this;

  // run command
  this.init();

}

util.inherits(Assertion, EventEmitter)

/**
  *
  *  Executes the command passed in by user and attaches event listners
  *
  */

Assertion.prototype.init = function (cb) {
  child = exec(this.concat, Assertion.childProcessCallback.bind(this))
  this.child = child;
  this.child.stdout.on("data", function(chunk){
    this.chunks.push(chunk);
  }.bind(this))
  if ('undefined' != typeof cb) { cb(); }
  return this;
}


/**
  *
  * Sends a message to the stdin stream.
  *
  */

Assertion.prototype.send = function (msg, cb) {
  this.child.stdin.write(msg)
  if ('undefined' != typeof cb) { cb(); }
  return this;
}

/**
  *
  * Triggers the "end" event on the stdio stream.
  *
  */

Assertion.prototype.end = function(cb){
  this.child.stdin.end();
  if ('undefined' != typeof cb) { cb(); }
  return this;
}

/** 
  * A callback timer
  * @api public
  */


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
  }
  return this;
}

/** 
  * Adds an Event listener that compares expected value to stdio on stream end.
  * @api public
  */

Assertion.prototype.equal = function equal(expected){
  
  this.child.stdout.on("end", function(){
    var actual = this.to.chunks;
    if (actual == expected) {
    } else {
      var err = new AssertionError(actual.toString(), expected)
      this.emit("error", err)
      throw err;
    }
  }.bind(this))
  return this;
}

/** 
  * Adds an Event listener that searches for expected pattern in the stdout on stream end.
  * @api public
  */

Assertion.prototype.contain = function contain(expected){
  
  this.child.stdout.on("end", function(){
    var actual = this.chunks[0]
    if ( actual.search(expected) > -1 ) {
      return this;
    } else {
      var err = new ContainsError(actual, expected);
      this.emit("error", err);
      throw err;
    }
  }.bind(this))
  return this;
}

/**
  * Plural aliases of methods
  */

Assertion.prototype.equals = Assertion.prototype.equal;
Assertion.prototype.contains = Assertion.prototype.contain;
module.exports = Assertion;