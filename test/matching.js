'use strict';

require('mocha');
const assert = require('assert');
const exact = require('./support/exact');
const fill = require('..');

const toRegex = (...args) => new RegExp(`^(${fill(...args)})$`);
const isMatch = (...args) => {
  let input = args.pop();
  let regex = toRegex(...args);
  return regex.test(input);
};

describe('when options.toRegex is used', () => {
  it('should create regex ranges for numbers in ascending order', () => {
    assert(!isMatch(2, 8, { toRegex: true }, '10'));
    assert(isMatch(2, 8, { toRegex: true }, '3'));
    assert(isMatch(2, 10, { toRegex: true }, '10'));
    assert(isMatch(2, 100, { toRegex: true }, '10'));
    assert(!isMatch(2, 100, { toRegex: true }, '101'));
  });

  it('should create regex ranges with positive and negative numbers', () => {
    assert(isMatch(-10, 10, { toRegex: true }, '10'));
    assert(isMatch(-10, 10, 2, { toRegex: true }, '10'));
  });

  it('should create regex ranges for numbers in descending order', () => {
    assert(isMatch(8, 2, { toRegex: true }, '2'));
    assert(isMatch(8, 2, { toRegex: true }, '8'));
    assert(!isMatch(8, 2, { toRegex: true }, '10'));
  });

  it('should create regex ranges when a step is given', () => {
    assert(!isMatch(8, 2, { toRegex: true, step: 2 }, '10'));
    assert(!isMatch(8, 2, { toRegex: true, step: 2 }, '3'));
    assert(!isMatch(8, 2, { toRegex: true, step: 2 }, '5'));
    assert(isMatch(8, 2, { toRegex: true, step: 2 }, '8'));
    assert(!isMatch(2, 8, { toRegex: true, step: 2 }, '10'));
    assert(!isMatch(2, 8, { toRegex: true, step: 2 }, '3'));
    assert(isMatch(2, 8, { toRegex: true, step: 2 }, '8'));
  });
});
