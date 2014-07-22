# assert-stdio

**assert-stdio** is a BDD-style, test-framework-agnostic assertion library for Node that tests the contents of stdio streams.  These stdio streams need not be Node applications and can be any shell command that interacts with the stdio stream.

##Getting Started

1. Install:

```bash
$ npm install assert-stdio
```

2. Require it and use it:

```javascript
var assert = require('assert-stdio')
assert("cat", [ "path/to/helloworld.txt" ], "hello, world")
```

##How it works

The ``require`` returns an assertion function taking 1 to 3 parameters: a **command** ``String``, an (optional) ``Array`` of **flags/arguments** and an **expected** output ``String``. 

It either returns an error (in the case of a failed assertion or invalid command) or the function call returns an ``EventEmitter`` and allows listeners to be attached to the various events triggered by the child process executing the desired command.

##Events API

###.send(msg, cb)

Sends a ``String`` **msg** to the stdin.

###.end(cb)

Terminates the child process in which the given command is running (also emits an 'end' event and triggers any chained comparisons)

###.equal(expected)

Compares ``stdout`` after executing the command to a given ``String``
```javascript
var assert = require('assert-stdio')
assert("cat", [ "path/to/helloworld.txt" ]).equals("hello, world").end()
```

###.contains(expected)

Searches for a given ``String`` or ``RegExp`` in the ``stdout`` after executing the command.
```javascript
var assert = require('assert-stdio')
assert("cat", [ "path/to/helloworld.txt" ]).contains("hello, world").end()
```
##Examples

###'should' syntax
```javascript
var cmd = require('assert-stdio')
cmd("cat", [ "path/to/helloworld.txt" ]).should.equal("hello, world").end();

```

###'expect' syntax
```javascript
var expect = require('assert-stdio')
expect("cat", [ "path/to/helloworld.txt" ]).to.equal("hello, world").end();

```

###assertion chaining
```javascript
var expect = require('assert-stdio')
expect("cat", [ "path/to/helloworld.txt" ]).to.equal("hello, world").end();

```

##Promises API

To use Promises, you must include the plugin after the assert-stdio library has been required.  When used, 

```javascript
var cmd = require('assert-stdio')
var Promises = require('assert-stdio/promises')
cmd.use(Promises)
cmd("cat", ["path/to/file"])
.then(function(result){
  // do something else when promise resolves
})
// returns a promise
```

##Mocha Examples
