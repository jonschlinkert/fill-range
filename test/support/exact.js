'use strict';

const util = require('util');
const assert = require('assert');

module.exports = (actual, expected) => {
  assert(Array.isArray(actual));
  let a = util.inspect(actual);
  let b = util.inspect(expected);
  assert.strictEqual(a, b, `${a} !== ${b}`);
};
