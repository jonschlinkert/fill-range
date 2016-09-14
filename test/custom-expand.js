'use strict';

require('mocha');
var repeat = require('repeat-string');
var isNumber = require('is-number');
var assert = require('assert');
var exact = require('./support/exact');
var fill = require('..');

describe('custom function for expansions:', function() {
  it('should expose the current value as the first param.', function() {
    var arr = fill(1, 5, function(val, a, b, step, idx, arr, options) {
      return val;
    });
    exact(arr, [1, 2, 3, 4, 5]);
  });

  it('should expose the `isNumber` boolean as the second param.', function() {
    var arr = fill('a', 'e', function(val, a, b, step, idx, arr, options) {
      return !isNumber ? String.fromCharCode(val) : val;
    });
    exact(arr, ['a', 'b', 'c', 'd', 'e']);
  });

  it('should expose padding `maxLength` on options', function() {
    var arr = fill('01', '05', function(val, a, b, step, idx, arr, options) {
      // increase padding by two
      return repeat('0', (options.maxLength + 2) - val.length) + val;
    });
    exact(arr, ['0001', '0002', '0003', '0004', '0005']);
  });

  it('should expose the index as the fifth param.', function() {
    var arr = fill('a', 'e', function(val, a, b, step, idx, arr, options) {
      return val + (idx - 1);
    });
    exact(arr, ['a0', 'b1', 'c2', 'd3', 'e4']);
  });
});
