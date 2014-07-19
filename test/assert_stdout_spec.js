var assert = require('../index.js').Stdout
var path = require('path')

describe("Assert.Stdout", function () {

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