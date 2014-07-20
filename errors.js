function AssertionError (actual, expected) {
  var concat = ["Expected: '", expected,"' to be: '", actual, "'"].join("")
  return Error(concat);
}

module.exports = AssertionError;