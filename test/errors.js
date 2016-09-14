'use strict';

require('mocha');
var assert = require('assert');
var fill = require('..');

describe('error handling', function() {
  it('should throw when range arguments are invalid and `strict` is true.', function() {
    assert.throws(function() {
      fill('0a', '0z', {strict: true});
    }, /invalid range arguments: \[ \'0a\', \'0z\' \]/);

    assert.throws(function() {
      fill('.', '*', 2, {strict: true});
    }, /invalid range arguments: \[ \'\.\', \'\*\' \]/);

    assert.throws(function() {
      fill('!', '$', {strict: true});
    }, /invalid range arguments: \[ \'\!\', \'\$\' \]/);
  });

  it('should throw when args are incompatible.', function() {
    assert.throws(function() {
      fill('a8', 10, {strict: true});
    }, /invalid range arguments: \[ \'a8\', 10 \]/);

    assert.throws(function() {
      fill(1, 'zz', {strict: true});
    }, /invalid range arguments: \[ 1, \'zz\' \]/);
  });

  it('should throw when the step is bad.', function() {
    assert.throws(function() {
      fill('1', '10', 'z', {strict: true});
    }, /expected options\.step to be a number/);
    assert.throws(function() {
      fill('a', 'z', 'a', {strict: true});
    }, /expected options\.step to be a number/);
    assert.throws(function() {
      fill('a', 'z', '0a', {strict: true});
    }, /expected options\.step to be a number/);
  });
});
