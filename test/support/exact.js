'use strict';

var util = require('util');
var assert = require('assert');

module.exports = function exact(a, b) {
  assert(Array.isArray(a));
  assert(Array.isArray(b));

  var aString = util.inspect(a, null, 10);
  var bString = util.inspect(b, null, 10);
  assert.equal(aString, bString, aString + ' !== ' + bString);
};
