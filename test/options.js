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

  describe('options.toRegex', function() {
    it('should create regex ranges for numbers in ascending order', function() {
      assert.equal(fill(2, 8, {toRegex: true}), '[2-8]');
      assert.equal(fill(2, 10, {toRegex: true}), '[2-9]|10');
      assert.equal(fill(2, 100, {toRegex: true}), '[2-9]|[1-9][0-9]|100');
    });

    it('should create regex ranges for numbers in descending order', function() {
      assert.equal(fill(8, 2, {toRegex: true}), '[2-8]');
    });

    it('should create regex ranges when a step is given', function() {
      assert.equal(fill(8, 2, {toRegex: true, step: 2}), '8|6|4|2');
      assert.equal(fill(2, 8, {toRegex: true, step: 2}), '2|4|6|8');
    });
  });
});
