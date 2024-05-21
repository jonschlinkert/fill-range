'use strict';

const assert = require('assert');
const util = require('util');

module.exports = (actual, expected) => {
  assert(Array.isArray(actual));
  let a = util.inspect(actual);
  let b = util.inspect(expected);
  assert.strictEqual(a, b, `${a} !== ${b}`);
};
