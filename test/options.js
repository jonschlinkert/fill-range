/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var exact = require('./support/exact');
var fill = require('..');

describe('options', function() {
  describe('options.stringify', function() {
    it('should cast values to strings', function() {
      exact(fill('1', '10', '1', {stringify: true}), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, 10, '2', {stringify: true}), ['2', '4', '6', '8', '10']);
      exact(fill(2, 10, 1, {stringify: true}), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, 10, 3, {stringify: true}), ['2', '5', '8']);
    });
  });

  describe('options.strict', function() {
    it('should return an empty array by default', function() {
      assert.deepEqual(fill('1.1', '2.1'), []);
      assert.deepEqual(fill('1.2', '2'), []);
      assert.deepEqual(fill('1.20', '2'), []);
      assert.deepEqual(fill('1', '0f'), []);
      assert.deepEqual(fill('1', '10', 'ff'), []);
      assert.deepEqual(fill('1', '10.f'), []);
      assert.deepEqual(fill('1', '10f'), []);
      assert.deepEqual(fill('1', '20', '2f'), []);
      assert.deepEqual(fill('1', '20', 'f2'), []);
      assert.deepEqual(fill('1', '2f', '2'), []);
      assert.deepEqual(fill('1', 'ff', '2'), []);
      assert.deepEqual(fill('1', 'ff'), []);
    });

    it('should throw on invalid range arguments are invalid and options.strict is true.', function() {
      assert.throws(function() {
        fill('0a', '0z', {strictRanges: true});
      }, /invalid range arguments: \[ \'0a\', \'0z\' \]/);

      assert.throws(function() {
        fill('.', '*', 2, {strictRanges: true});
      }, /invalid range arguments: \[ \'\.\', \'\*\' \]/);

      assert.throws(function() {
        fill('!', '$', {strictRanges: true});
      }, /invalid range arguments: \[ \'\!\', \'\$\' \]/);
    });

    it('should throw when args are incompatible.', function() {
      assert.throws(function() {
        fill('a8', 10, {strictRanges: true});
      }, /invalid range arguments: \[ \'a8\', 10 \]/);

      assert.throws(function() {
        fill(1, 'zz', {strictRanges: true});
      }, /invalid range arguments: \[ 1, \'zz\' \]/);
    });

    it('should throw when the step is bad.', function() {
      assert.throws(function() {
        fill('1', '10', 'z', {strictRanges: true});
      }, /expected options\.step to be a number/);
      assert.throws(function() {
        fill('a', 'z', 'a', {strictRanges: true});
      }, /expected options\.step to be a number/);
      assert.throws(function() {
        fill('a', 'z', '0a', {strictRanges: true});
      }, /expected options\.step to be a number/);
    });
  });

  describe('options.toRegex', function() {
    it('should create regex ranges for numbers in ascending order', function() {
      assert.equal(fill(2, 8, {toRegex: true}), '[2-8]');
      assert.equal(fill(2, 10, {toRegex: true}), '[2-9]|10');
      assert.equal(fill(2, 100, {toRegex: true}), '[2-9]|[1-9][0-9]|100');
    });

    it('should support zero-padding', function() {
      assert.equal(fill('002', '008', {toRegex: true}), '0{2}[2-8]');
      assert.equal(fill('02', '08', {toRegex: true}), '0[2-8]');
      assert.equal(fill('02', '10', {toRegex: true}), '0[2-9]|10');
      assert.equal(fill('002', '100', {toRegex: true}), '0{2}[2-9]|0[1-9][0-9]|100');
    });

    it('should support negative zero-padding', function() {
      assert.equal(fill('-02', '-08', {toRegex: true}), '-0*[2-8]');
      assert.equal(fill('-02', '100', {toRegex: true}), '-0*[12]|0{2}[0-9]|0[1-9][0-9]|100');
      assert.equal(fill('-02', '-100', {toRegex: true}), '-0*[2-9]|-0*[1-9][0-9]|-0*100');
      assert.equal(fill('-002', '-100', {toRegex: true}), '-0*[2-9]|-0*[1-9][0-9]|-0*100');
    });

    it('should create regex ranges for alpha chars defined in ascending order', function() {
      assert.equal(fill('a', 'b', {toRegex: true}), '[a-b]');
      assert.equal(fill('A', 'b', {toRegex: true}), '[A-b]');
      assert.equal(fill('Z', 'a', {toRegex: true}), '[Z-a]');
    });

    it('should create regex ranges for alpha chars defined in descending order', function() {
      assert.equal(fill('z', 'A', {toRegex: true}), '[A-z]');
    });

    it('should create regex ranges with positive and negative numbers', function() {
      assert.equal(fill(-10, 10, {toRegex: true}), '-[1-9]|-?10|[0-9]');
      assert.equal(fill(-10, 10, 2, {toRegex: true}), '0|2|4|6|8|10|-(10|8|6|4|2)');
    });

    it('should create regex ranges for numbers in descending order', function() {
      assert.equal(fill(8, 2, {toRegex: true}), '[2-8]');
    });

    it('should create regex ranges when a step is given', function() {
      assert.equal(fill(8, 2, {toRegex: true, step: 2}), '8|6|4|2');
      assert.equal(fill(2, 8, {toRegex: true, step: 2}), '2|4|6|8');
    });
  });

  describe('options.capture', function() {
    it('should wrap the returned string in parans', function() {
      assert.equal(fill(-10, 10, {toRegex: true, capture: true}), '(-[1-9]|-?10|[0-9])');
      assert.equal(fill(-10, 10, 2, {toRegex: true, capture: true}), '(0|2|4|6|8|10|-(10|8|6|4|2))');
    });
  });
});
