/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
const assert = require('assert');
const expand = require('./support/expand');
const exact = require('./support/exact');
const fill = require('..');

function toRegex(...args) {
  const str = fill(...args);
  return new RegExp('^(' + str + ')$');
}
function matcher(...args) {
  const regex = toRegex(...args);
  return function(num) {
    return regex.test(String(num));
  };
}
function isMatch(...args) {
  const last = args.pop();
  const fn = matcher.apply(null, args);
  return fn(last);
}

describe('when options.toRegex is used', function() {
  it('should create regex ranges for numbers in ascending order', function() {
    assert(!isMatch(2, 8, {toRegex: true}, '10'));
    assert(isMatch(2, 8, {toRegex: true}, '3'));
    assert(isMatch(2, 10, {toRegex: true}, '10'));
    assert(isMatch(2, 100, {toRegex: true}, '10'));
    assert(!isMatch(2, 100, {toRegex: true}, '101'));
  });

  it('should create regex ranges with positive and negative numbers', function() {
    assert(isMatch(-10, 10, {toRegex: true}, '10'));
    assert(isMatch(-10, 10, 2, {toRegex: true}, '10'));
  });

  it('should create regex ranges for numbers in descending order', function() {
    assert(isMatch(8, 2, {toRegex: true}, '2'));
    assert(isMatch(8, 2, {toRegex: true}, '8'));
    assert(!isMatch(8, 2, {toRegex: true}, '10'));
  });

  it('should create regex ranges when a step is given', function() {
    assert(!isMatch(8, 2, {toRegex: true, step: 2}, '10'));
    assert(!isMatch(8, 2, {toRegex: true, step: 2}, '3'));
    assert(!isMatch(8, 2, {toRegex: true, step: 2}, '5'));
    assert(isMatch(8, 2, {toRegex: true, step: 2}, '8'));
    assert(!isMatch(2, 8, {toRegex: true, step: 2}, '10'));
    assert(!isMatch(2, 8, {toRegex: true, step: 2}, '3'));
    assert(isMatch(2, 8, {toRegex: true, step: 2}, '8'));
  });
});
