var AssertionError = require('./errors')
/** this function extends an assertion.
  * it can be passed in with the .use method.
  */

module.exports = function(){
  // makes "using" getter
  this.Assertion.using = function(){
    return "events"
  }

  this.Assertion.childProcessCallback = function (err, stdout, stderr) {
    if (err) {
      this.emit("end");
    } 
    // compare using strict operator
    if (stdout === this.expected) {
      this.emit("end");
    } else {
      this.error = new AssertionError(stdout, this.expected)
      this.emit("error", this.error);
    }
  }

}