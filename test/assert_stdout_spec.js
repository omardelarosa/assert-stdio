var path = require('path')
var Promises = require('../promises')
var Events = require('../events')
var AssertionError = require('../errors')

describe("Assert.Stdout", function () {

  describe("when using no modules", function(){
    
    var assert = require('../index.js').Stdout

    it("should close when a valid command is sent and expected value is received", function(done){
      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
      done();
    })
  
  })

  describe("when using Promises plugin", function(){

    var assert = require('../index.js').Stdout
    
    before(function(){
      assert.use(Promises)
    })

    it("should be chainable", function(done){

      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
        .then(function(){
          return assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")  
        })
        .then(function(){
          return assert("cat", [path.resolve("./test/fixtures/sample2.txt")], "goodbye, world")
        })
        .then(function(){
          return assert("cat", [path.resolve("./test/fixtures/sample3.txt")], "hello again, world")
        })
        .nodeify(done);
    })

    it("should close and error when invalid command is sent", function (done) {
      assert("asdfasdf", ["-al"], "sdff")
        .then(done)
        .catch(function(err){
          done()
        });
    });

    it("should close when a valid command is sent and expected value is received", function (done) {
      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
        .then(done)
    });

    it("should raise an error when a valid command's output doesn't match the expected output", function (done) {
      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, worldasdfa")
        .catch(function(err){
          done();
        })
    })

  })

  describe("when using Events plugin", function(){

    var assert = require('../index.js').Stdout
    
    before(function(){
      assert.use(Events)
    })

    it("should allow listening for 'end' events", function(done){
      var a = assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
      a.on("end", function(){
        done();
      })
    })

    it("should fire an 'error' event on errors", function(done){
      var a = assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, worlddddd")
      a.on("error", function(err){
        done();
      })
    })

    describe("non-terminating processes", function(){
    
      it("should keep processes alive until closed and then assert", function(done){
        var a = assert("telnet", [], "telnet> ")
        setTimeout(function(){
          a.child.stdin.end()
        }, 1900)
        a.on("end", function(){
          done();
        })
      })
    
      it("should keep processes alive, accept input and assert entire results", function(done){
        var a = assert("telnet", [], "telnet> No connection.\nEscape character is '^]'.\ntelnet> ")
        a.child.stdin.write("status")
        a.child.stdin.end();
        a.on("end", function(){
          done();
        })
      })

    })

  })
  
})