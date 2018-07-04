'use strict';

require('mocha');
const isNumber = require('is-number');
const assert = require('assert');
const exact = require('./support/exact');
const fill = require('..');

describe('custom function for expansions:', function() {
  it('should expose the current value as the first param.', function() {
    exact(fill(1, 5, val => val), [1, 2, 3, 4, 5]);
    exact(fill('a', 'e', val => val), ['a', 'b', 'c', 'd', 'e']);
  });

  it('should expose padding `maxLength` on options', function() {
    const arr = fill('01', '05', function(val, a, b, step, idx, arr, options) {
      // increase padding by two
      return '0'.repeat(options.maxLength - val.length + 2) + val;
    });
    exact(arr, ['0001', '0002', '0003', '0004', '0005']);
  });

  it('should expose the index as the fifth param.', function() {
    const arr = fill('a', 'e', function(val, a, b, step, idx, arr, options) {
      return val + (idx - 1);
    });
    exact(arr, ['a0', 'b1', 'c2', 'd3', 'e4']);
  });
});
