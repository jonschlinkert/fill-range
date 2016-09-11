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

describe('ranges', function() {
  describe('alphabetical', function() {
    it('should increment alphabetical ranges', function() {
      exact(fill('a'), ['a']);
      exact(fill('a', 'a'), ['a']);
      exact(fill('a', 'b'), ['a', 'b']);
      exact(fill('a', 'e'), ['a', 'b', 'c', 'd', 'e']);
      exact(fill('A', 'E'), ['A', 'B', 'C', 'D', 'E']);
    });

    it('should decrement alphabetical ranges', function() {
      exact(fill('E', 'A'), ['E', 'D', 'C', 'B', 'A']);
      exact(fill('a', 'C'), ['a','`','_','^',']',"\\",'[','Z','Y','X','W','V','U','T','S','R','Q','P','O','N','M','L','K','J','I','H','G','F','E','D','C']);
      exact(fill('z', 'm'), ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm']);
    });
  });

  describe('alphanumeric', function() {
    it('should increment alphanumeric ranges', function() {
      exact(fill('9', 'B'), ['9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B']);
      exact(fill('A', '10'), ['A', '@', '?', '>', '=', '<', ';', ':', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
      exact(fill('a', '10'), ['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', '@', '?', '>', '=', '<', ';', ':', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
    });

    it('should step alphanumeric ranges', function() {
      exact(fill('9', 'B', 3), [ '9', '<', '?', 'B' ]);
    });

    it('should decrement alphanumeric ranges', function() {
      exact(fill('C', '9'), ['C', 'B', 'A', '@', '?', '>', '=', '<', ';', ':', '9']);
    });
  });

  describe('ranges: letters', function() {
    it('should increment alphabetical ranges', function() {
      exact(fill('a'), ['a']);
      exact(fill('a', 'a'), ['a']);
      exact(fill('a', 'b'), ['a', 'b']);
      exact(fill('a', 'e'), ['a', 'b', 'c', 'd', 'e']);
      exact(fill('A', 'E'), ['A', 'B', 'C', 'D', 'E']);
    });

    it('should decrement alphabetical ranges', function() {
      exact(fill('E', 'A'), ['E', 'D', 'C', 'B', 'A']);
      exact(fill('a', 'C'), ['a','`','_','^',']',"\\",'[','Z','Y','X','W','V','U','T','S','R','Q','P','O','N','M','L','K','J','I','H','G','F','E','D','C']);
      exact(fill('z', 'm'), ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm']);
    });
  });

  describe('numbers', function() {
    it('should increment numerical *string* ranges', function() {
      exact(fill('1'), ['1']);
      exact(fill('1', '1'), ['1']);
      exact(fill('1', '2'), ['1', '2']);
      exact(fill('1', '10'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill('1', '3'), ['1', '2', '3']);
      exact(fill('5', '8'), ['5', '6', '7', '8']);
      exact(fill(1, '9'), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    });

    it('should increment numerical *number* ranges', function() {
      exact(fill(1, 3), [1, 2, 3]);
      exact(fill(1, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
      exact(fill(5, 8), [5, 6, 7, 8]);
    });

    it('should increment numerical ranges that are a combination of number and string', function() {
      exact(fill(1, '9'), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
      exact(fill('2', 5), ['2', '3', '4', '5']);
    });

    it('should decrement numerical *string* ranges', function() {
      exact(fill('0', '-5'), ['0', '-1', '-2', '-3', '-4', '-5']);
      exact(fill('-1', '-5'), ['-1', '-2', '-3', '-4', '-5']);
    });

    it('should decrement numerical *number* ranges', function() {
      exact(fill(-10, -1), [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]);
      exact(fill(0, -5), [0, -1, -2, -3, -4, -5]);
    });

    it('should handle *string* ranges ranges that are positive and negative:', function() {
      exact(fill('9', '-4'), ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
      exact(fill('-5', '5'), ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5']);
    });

    it('should handle *number* ranges ranges that are positive and negative:', function() {
      exact(fill(9, -4), [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4]);
      exact(fill(-5, 5), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]);
    });
  });
});
