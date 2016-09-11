'use strict';

require('mocha');
var repeat = require('repeat-string');
var isNumber = require('is-number');
var assert = require('assert');
var exact = require('./support/exact');
var fill = require('..');

describe.skip('custom function for expansions:', function() {
  it('should expose the current value as the first param.', function() {
    var arr = fill(1, 5, function(n, a, b, idx, arr, options) {
      return n;
    });
    assert(exact(arr, [1, 2, 3, 4, 5]));
  });

  it('should expose the `isNumber` boolean as the second param.', function() {
    var arr = fill('a', 'e', function(n, a, b, idx, arr, options) {
      return !isNumber ? String.fromCharCode(n) : n;
    });
    assert(exact(arr, ['a', 'b', 'c', 'd', 'e']));
  });

  it('should expose padding `maxLength` on options', function() {
    var arr = fill('01', '05', function(n, a, b, idx, arr, options) {
      return repeat('0', (options.maxLength - String(n).length) * 2) + n;
    });
    assert(exact(arr, ['001', '002', '003', '004', '005']));
  });

  it('should expose the index as the fourth param.', function() {
    var arr = fill('a', 'e', function(n, a, b, idx, arr, options) {
      return !options.isNumber ? (String.fromCharCode(n) + (idx - 1)) : n;
    });
    assert(exact(arr, ['a0', 'b1', 'c2', 'd3', 'e4']));
  });
});
