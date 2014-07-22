var path = require('path')
var Promises = require('../promises')
var AssertionError = require('../errors').AssertionError

describe("AssertStdio", function () {

  describe("when using Event-based assertions", function(){

    var assert = require('../index.js')

    it("should allow listening for 'end' events", function(done){
      assert("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
        .end(done)
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
            this.end(done);
          })
      })
    
      it("should keep processes alive, accept input and assert entire results", function(done){
        assert("telnet", [], "telnet> No connection.\nEscape character is '^]'.\ntelnet> ")
          .send("status")
          .end(done);
      })

    })

    describe("when there are only two args (no 'expected' string)", function(){

      describe(" 'should' syntax can be used", function(done){

        var cmd = require('../index.js')
        var file = [path.resolve("./test/fixtures/sample.txt")];

        it(".to.equal() compares to a valid string ", function(done){
          cmd("cat", file).should.equal("hello, world").end()
            done();
        })

        it(".to.contain() searches for RegExp match", function(done){
          cmd("cat", file).should.contain(/ell/).end()
          done();
        })

        it(".to.contain() searches for String match", function(done){
          cmd("cat", file).should.contain("hello").end()
          done();
        })

      })

      describe(" 'expect' syntax can be used", function(done){

        var expect = require('../index.js')
        var file = [path.resolve("./test/fixtures/sample.txt")];

        it(" .to.equal() compares to a valid string ", function(done){
          expect("cat", file).to.equal("hello, world").end(done)
        })

        it("to.contain() searches for RegExp match", function(done){
          expect("cat", file).to.contain(/ell/).end(done)
        })

        it("to.contain() searches for String match", function(done){
          expect("cat", file).to.contain("hello").end(done)
        })

        it("to.contain().and.to.contain() can be chained", function(done){
          expect("cat", file).to.contain("hello")
            .and.contain("world").end(done)
        })

      })

      describe(" 'assert' syntax can be used with plural methods", function(done){

        var assert = require('../index.js')
        var file = [path.resolve("./test/fixtures/sample.txt")];

        it(".equals() compares to a valid string ", function(done){
          assert("cat", file).equals("hello, world").end(done)
        })

        it(".contains() searches for RegExp match", function(done){
          assert("cat", file).contains(/ell/).end(done)
        })

        it(".contains() searches for String match", function(done){
          assert("cat", file).contains("hello").end(done)
        })

        it(".contains().and.contains() can be chained", function(done){
          assert("cat", file).contains("hello")
            .and.contains("world").end(done)
        })

      })

    })

  })

  describe("when using Promises plugin", function(){

    var cmd = require('../index.js')
    
    before(function(){
      cmd.use(Promises)
    })

    it(".then should be chainable", function(done){

      cmd("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
        .then(function(result){
          return cmd("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")  
        })
        .then(function(result){
          return cmd("cat", [path.resolve("./test/fixtures/sample2.txt")], "goodbye, world")
        })
        .then(function(result){
          return cmd("cat", [path.resolve("./test/fixtures/sample3.txt")], "hello again, world")
        })
        .nodeify(done);
    })

    it(".catch closes and errors when invalid command is sent", function (done) {
      cmd("asdfasdf", ["-al"], "sdff")
        .catch(function(err){
          done()
        })
    });

    it("should close when a valid command is sent and expected value is received", function (done) {
      cmd("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, world")
        .and.end(done)
    });

    it("should raise an error when a valid command's output doesn't match the expected output", function (done) {
      cmd("cat", [path.resolve("./test/fixtures/sample.txt")], "hello, worldasdfa")
        .catch(function(err){
          done();
        })
    })

  })
  
})