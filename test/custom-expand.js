'use strict';

require('mocha');
const assert = require('assert');
const exact = require('./support/exact');
const fill = require('..');

describe('custom function for expansions:', () => {
  it('should expose the current value as the first param.', () => {
    exact(fill(1, 5, value => value), [1, 2, 3, 4, 5]);
  });

  it('should expose the character code for non-integers', () => {
    let arr = fill('a', 'e', code => String.fromCharCode(code));
    exact(arr, ['a', 'b', 'c', 'd', 'e']);
  });

  it('should expose padding `maxLength` on options', () => {
    let arr = fill('01', '05', value => {
      return String(value).padStart(String(value).length + 3, '0');
    });
    exact(arr, ['0001', '0002', '0003', '0004', '0005']);
  });

  it('should expose the index as the fifth param.', () => {
    let arr = fill('a', 'e', (code, index) => {
      return String.fromCharCode(code) + index;
    });
    exact(arr, ['a0', 'b1', 'c2', 'd3', 'e4']);
  });
});
