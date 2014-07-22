var AssertionError = require('./errors').AssertionError

/** this function extends an assertion.
  * it can be passed in with the .use method.
  */

module.exports = function(){

  this.Assertion.using = function(){
    return "promises"
  }

  this.Assertion.childProcessCallback = function(err, stdout, stderr){
  
    var promise = this.opts.dfd
    if (err) {
      promise.reject(err);
    } 
    // compare only if "expected" was passed in
    if (this.opts.expected) {
      if (stdout === this.opts.expected) {
        promise.resolve(this);
      } else {
        this.error = new AssertionError(stdout, this.opts.expected)
        promise.reject(this.error);
      }
    }
  }

}