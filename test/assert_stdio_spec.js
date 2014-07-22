var path = require('path')
var Promises = require('../promises')
var AssertionError = require('../errors').AssertionError

describe("AssertStdio", function () {

  describe("when using Event-based assertions", function(){

    var assert = require('../index.js')

    it("should allow listening for 'end' events", function(done){
      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
        .on("end", function(){
          done();
        })
    })

    it("should fire an 'error' event on errors", function(done){
      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, worlddddd")
        .on("error", function(err){
          done();
        })
    })

    describe("non-terminating processes", function(){
    
      it("should keep processes alive until closed and then assert", function(done){
        assert("telnet", [], "telnet> ")  
          .in(1000,function(){
            this.end();
          })
          .on("end", function(){
            done();
          })
      })
    
      it("should keep processes alive, accept input and assert entire results", function(done){
        assert("telnet", [], "telnet> No connection.\nEscape character is '^]'.\ntelnet> ")
          .send("status")
          .on("end", function(){
            done();
          })
          .end();
      })

    })

    describe("when there are only two args (no 'expected' string)", function(){

      describe(" 'should' syntax can be used", function(done){

        var a = require('../index.js')
        var file = [path.resolve("./test/fixtures/sample.txt")];

        it(" .to.equal() compares to a valid string ", function(done){
          a("cat", file).should.equal("hello, world").end()
            done();
        })

        it("to.contain() searches for RegExp match", function(done){
          a("cat", file).should.contain(/ell/).end()
          done();
        })

        it("to.contain() searches for String match", function(done){
          a("cat", file).should.contain("hello").end()
          done();
        })

      })

      describe(" 'expect 'syntax can be used", function(done){

        var expect = require('../index.js')
        var file = [path.resolve("./test/fixtures/sample.txt")];

        it(" .to.equal() compares to a valid string ", function(done){
          expect("cat", file).to.equal("hello, world").end()
            done();
        })

        it("to.contain() searches for RegExp match", function(done){
          expect("cat", file).to.contain(/ell/).end()
          done();
        })

        it("to.contain() searches for String match", function(done){
          expect("cat", file).to.contain("hello").end()
          done();
        })

      })

    })

  })

  describe("when using Promises plugin", function(){

    var assert = require('../index.js')
    
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
  
})