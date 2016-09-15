/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var expand = require('./support/expand');
var exact = require('./support/exact');
var fill = require('..');

function toRegex() {
  var str = fill.apply(null, arguments);
  return new RegExp('^(' + str + ')$');
}
function matcher() {
  var regex = toRegex.apply(null, arguments);
  return function(num) {
    return regex.test(String(num));
  };
}
function isMatch() {
  var args = [].slice.call(arguments);
  var last = args.pop();
  var fn = matcher.apply(null, args);
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
