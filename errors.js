function AssertionError (actual, expected) {
  var concat = ["Expected: '", actual,"' to be: '", expected, "'"].join("")
  return Error(concat);
}

function ContainsError (actual, expected) {
  var concat = ["Expected: '", actual,"' to contain: '", expected.toString(), "'"].join("")
  return Error(concat);
}

module.exports = {
  AssertionError: AssertionError,
  ContainsError: ContainsError
}