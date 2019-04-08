'use strict';

require('mocha');
const util = require('util');
const assert = require('assert');
const exact = require('./support/exact');
const fill = require('..');

describe('options', () => {
  describe('options.stringify', () => {
    it('should cast values to strings', () => {
      let opts = { stringify: true };
      exact(fill('1', '10', '1', opts), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, 10, '2', opts), ['2', '4', '6', '8', '10']);
      exact(fill(2, 10, 1, opts), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, 10, 3, opts), ['2', '5', '8']);
    });
  });

  describe('options.transform', () => {
    it('should cast values to strings', () => {
      let transform = value => String(value);
      exact(fill('1', '10', '1', { transform }), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, 10, '2', { transform }), ['2', '4', '6', '8', '10']);
      exact(fill(2, 10, 1, { transform }), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, 10, 3, { transform }), ['2', '5', '8']);
    });
  });

  describe('options.toRegex', () => {
    let opts = { toRegex: true };

    it('should create regex ranges for numbers in ascending order', () => {
      assert.equal(fill(2, 8, opts), '[2-8]');
      assert.equal(fill(2, 10, opts), '[2-9]|10');
      assert.equal(fill(2, 100, opts), '[2-9]|[1-9][0-9]|100');
    });

    it('should create regex ranges with positive and negative numbers', () => {
      assert.equal(fill(-10, 10, opts), '-[1-9]|-?10|[0-9]');
      assert.equal(fill(-10, 10, 2, opts), '0|2|4|6|8|10|-(?:2|4|6|8|10)');
      assert.equal(fill(-10, 0, 2, opts), '0|-(?:2|4|6|8|10)');
      assert.equal(fill(-10, -2, 2, opts), '-(?:2|4|6|8|10)');
    });

    it('should create regex ranges for numbers in descending order', () => {
      assert.equal(fill(8, 2, opts), '[2-8]');
    });

    it('should create regex ranges when a step is given', () => {
      assert.equal(fill(8, 2, { toRegex: true, step: 2 }), '2|4|6|8');
      assert.equal(fill(2, 8, { toRegex: true, step: 2 }), '2|4|6|8');
    });

    it('should support zero-padding', () => {
      assert.equal(fill('002', '008', opts), '0{0,2}[2-8]');
      assert.equal(fill('02', '08', opts), '0?[2-8]');
      assert.equal(fill('02', '10', opts), '0?[2-9]|10');
      assert.equal(fill('002', '100', opts), '0{0,2}[2-9]|0?[1-9][0-9]|100');
    });

    it('should support negative zero-padding', () => {
      assert.equal(fill('-002', '-100', opts), '-0{0,3}[2-9]|-0{0,2}[1-9][0-9]|-0?100');
      assert.equal(fill('-02', '-08', opts), '-0{0,2}[2-8]');
      assert.equal(fill('-02', '-100', opts), '-0{0,3}[2-9]|-0{0,2}[1-9][0-9]|-0?100');
      assert.equal(fill('-02', '100', opts), '-0{0,2}[12]|0{0,2}[0-9]|0?[1-9][0-9]|100');
    });

    it('should create regex ranges for alpha chars defined in ascending order', () => {
      assert.equal(fill('a', 'b', opts), '[a-b]');
      assert.equal(fill('A', 'b', opts), '[A-b]');
      assert.equal(fill('Z', 'a', opts), '[Z-a]');
    });

    it('should create regex ranges for alpha chars defined in descending order', () => {
      assert.equal(fill('z', 'A', opts), '[A-z]');
    });
  });

  describe('options.wrap', () => {
    let opts = { toRegex: true, wrap: true };

    it('should not wrap regex ranges with a single condition in parentheses', () => {
      assert.equal(fill(2, 8, opts), '[2-8]');
    });

    it('should wrap regex ranges in parentheses', () => {
      assert.equal(fill(2, 10, opts), '(?:[2-9]|10)');
      assert.equal(fill(2, 100, opts), '(?:[2-9]|[1-9][0-9]|100)');
    });

    it('should wrap ranges with positive and negative numbers in parentheses', () => {
      assert.equal(fill(-10, -2, 2, opts), '(?:-(?:2|4|6|8|10))');
      assert.equal(fill(-10, 0, 2, opts), '(?:0|-(?:2|4|6|8|10))');
      assert.equal(fill(-10, 10, 2, opts), '(?:0|2|4|6|8|10|-(?:2|4|6|8|10))');
      assert.equal(fill(-10, 10, opts), '(?:-[1-9]|-?10|[0-9])');
    });
  });

  describe('options.capture', () => {
    it('should wrap the returned string in parans', () => {
      let opts = { toRegex: true, capture: true };
      assert.equal(fill(-10, 10, 2, opts), '(0|2|4|6|8|10|-(2|4|6|8|10))');
      assert.equal(fill(-10, 10, opts), '(-[1-9]|-?10|[0-9])');
    });
  });
});
