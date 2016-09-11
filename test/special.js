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

describe.skip('special cases', function() {
  describe('negative zero', function() {
    it('should handle negative zero', function() {
      assert(exact(fill('-5', '-0', '-1'), ['-5', '-4', '-3', '-2', '-1', '0']));
      assert(exact(fill('1', '-0', 1), ['1', '0']));
      assert(exact(fill('1', '-0', 0), ['1', '0']));
      assert(exact(fill('1', '-0', '0'), ['1', '0']));
      assert(exact(fill('1', '-0', '1'), ['1', '0']));
      assert(exact(fill('-0', '-0', '1'), ['0']));
      assert(exact(fill('-0', '0', '1'), ['0']));
      assert(exact(fill('-0', '5', '1'), ['0', '1', '2', '3', '4', '5']));
      assert(exact(fill(-0, 5), [0, 1, 2, 3, 4, 5]));
      assert(exact(fill(5, -0, 5), [5, 0]));
      assert(exact(fill(5, -0, 2), [5, 3, 1]));
      assert(exact(fill(-0, 5, 2), [5, 3, 1]));
    });

    it('should adjust padding for negative numbers:', function() {
      assert(exact(fill('-01', '5'), ['-01','000','001','002','003','004','005']));
    });
  });

  describe('special characters:', function() {
    it('should use the step defined on the options:', function() {
      var opts = { step: '~' };
      assert(exact(fill('a', 'e', opts), ['[a-e]']));
      assert(exact(fill('E', 'A', opts), ['(E|D|C|B|A)']));
    });

    describe('repeat:', function() {
      it('should repeat the first arg `n` times:', function() {
        assert(exact(fill('a', 3, '+'), ['a', 'a', 'a']));
        assert(exact(fill('abc', 2, '+'), ['abc', 'abc']));
      });
    });

    describe('join:', function() {
      it('should join values when `>` is passed:', function() {
        assert(exact(fill('a', 'e', '>'), ['abcde']));
        assert(exact(fill('A', 'E', '>'), ['ABCDE']));
        assert(exact(fill('E', 'A', '>'), ['EDCBA']));
        assert(exact(fill('5', '8', '>'), ['5678']));
      });

      it('should use steps with joined values:', function() {
        assert(exact(fill('A', 'Z', '>5'), ['AFKPUZ']));
        assert(exact(fill('2', '20', '2>'), ['2468101214161820']));
        assert(exact(fill('2', '20', '>2'), ['2468101214161820']));
      });
    });

    describe('randomize:', function() {
      it('should randomize using the first two args when `?` is passed:', function() {
        assert(/[\w\d]{5}/.test(fill('A0', 5, '?')));
        assert(!/[\w\d]{6}/.test(fill('A0', 5, '?')));
        assert(!/\d{5}/.test(fill('A', 5, '?')));
        assert(/.{5}/.test(fill('*', 5, '?')));
        assert(/[^\W]{10}/.test(fill('aA0', 10, '?')));
      });
    });

    describe('regex string:', function() {
      it('should respect padding when special chars are used:', function() {
        assert(exact(fill('05', '100', '10'), ['005','015','025','035','045','055','065','075','085','095']));
        assert(exact(fill('05', '100', '10|'), ['(005|015|025|035|045|055|065|075|085|095)']));
        assert(exact(fill('05', '100', '|10'), ['(005|015|025|035|045|055|065|075|085|095)']));
        assert(exact(fill('05', '100', '10~'), ['(005|015|025|035|045|055|065|075|085|095)']));
      });

      it('should create a regex logical `or`:', function() {
        assert(exact(fill('c', 'a', '|'), ['(c|b|a)']));
        assert(exact(fill('z', 'a', '|5'), ['(z|u|p|k|f|a)']));
        assert(exact(fill('a', 'e', '2|'), ['(a|c|e)']));
        assert(exact(fill('a', 'e', '|2'), ['(a|c|e)']));
        assert(exact(fill('a', 'z', '|5'), ['(a|f|k|p|u|z)']));
        assert(exact(fill('a', 'C', '|'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']));
        assert(exact(fill('a', 'C', '~'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']));
      });

      it('should create a regex character class (range):', function() {
        assert(exact(fill('a', 'c', '|'), ['[a-c]']));
        assert(exact(fill('1', '3', '|'), ['[1-3]']));
      });

      it('should create a regex character class when `optimize` is true:', function() {
        assert(exact(fill('a', 'c', {optimize: true}), ['[a-c]']));
        assert(exact(fill('1', '3', {optimize: true}), ['[1-3]']));
      });

      it('should not create a regex character class when `optimize` is false:', function() {
        assert(exact(fill('a', 'c', {optimize: false}), ['a', 'b', 'c']));
        assert(exact(fill('1', '3', {optimize: false}), ['1', '2', '3']));
      });

      it('should not create a regex character class for negative numbers:', function() {
        assert(exact(fill('-1', '2'), ['-1', '0', '1', '2']));
        assert(exact(fill('-1', '2', '~'), ['-1', '0', '1', '2']));
        assert(exact(fill('0', '-2'), ['0', '-1', '-2']));
        assert(exact(fill('0', '-2', '~'), ['0', '-1', '-2']));
      });

      it('should not wrap a single value:', function() {
        assert(exact(fill(1, 1, '~'), ['1']));
        assert(exact(fill('e', 'e', '~'), ['e']));
      });

      it('when a step is zero it should be coerced to a one:', function() {
        assert(exact(fill('a', 'e', '0'), ['a', 'b', 'c', 'd', 'e']));
        assert(exact(fill('a', 'e', '0|'), ['[a-e]']));
        assert(exact(fill('a', 'e', '~0'), ['[a-e]']));
        assert(exact(fill('a', 'e', '|0'), ['[a-e]']));
      });
    });
  });

  describe('syntax detection:', function() {
    describe('should determine the correct syntax to avoid creating out-of-order ranges:', function() {
      it('should create valid character classes for numbers:', function() {
        assert(exact(fill(1, 3, '~'), ['[1-3]']));
        assert(exact(fill(1, 3, '~1'), ['[1-3]']));
        assert(exact(fill(1, 3, '|'), ['[1-3]']));
        assert(exact(fill(1, 3, '|1'), ['[1-3]']));

        assert(exact(fill('1', '3', '|'), ['[1-3]']));
        assert(exact(fill('1', '3', '|1'), ['[1-3]']));
        assert(exact(fill('1', '3', '~'), ['[1-3]']));
        assert(exact(fill('1', '3', '~1'), ['[1-3]']));

        assert(exact(fill('0', '9', '|'), ['[0-9]']));
        assert(exact(fill('0', '9', '~'), ['[0-9]']));
      });

      it('should create valid logical `or`s for descending numbers:', function() {
        assert(exact(fill('5', '1', '|'), ['(5|4|3|2|1)']));
        assert(exact(fill('5', '1', '~'), ['(5|4|3|2|1)']));
        assert(exact(fill('3', '1', '~1'), ['(3|2|1)']));
        assert(exact(fill('3', '1', '~|'), ['(3|2|1)']));
      });

      it('should create valid character classes for letters:', function() {
        assert(exact(fill('a', 'c', '~'), ['[a-c]']));
        assert(exact(fill('a', 'c', '|'), ['[a-c]']));
        assert(exact(fill('a', 'z', '~'), ['[a-z]']));
        assert(exact(fill('a', 'z', '|'), ['[a-z]']));
      });

      it('should create valid logical `or`s for numbers:', function() {
        assert(exact(fill('1', '10', '~'), ['(1|2|3|4|5|6|7|8|9|10)']));
        assert(exact(fill('10', '11', '~'), ['(10|11)']));
        assert(exact(fill('10', '11', '|'), ['(10|11)']));
        assert(exact(fill('11', '10', '~'), ['(11|10)']));
        assert(exact(fill('11', '10', '|'), ['(11|10)']));
        assert(exact(fill(10, 20, '|'), ['(10|11|12|13|14|15|16|17|18|19|20)']));
        assert(exact(fill(10, 20, '~'), ['(10|11|12|13|14|15|16|17|18|19|20)']));
        assert(exact(fill(9, 9, '|'), ['9']));
      });

      it('should create valid logical `or`s for letters:', function() {
        assert(exact(fill('c', 'a', '|'), ['(c|b|a)']));
        assert(exact(fill('c', 'a', '~'), ['(c|b|a)']));

        assert(exact(fill('a', 'z', '5~'), ['(a|f|k|p|u|z)']));
        assert(exact(fill('a', 'z', '5~'), ['(a|f|k|p|u|z)']));

        assert(exact(fill('z', 'a', '5|'), ['(z|u|p|k|f|a)']));
        assert(exact(fill('z', 'a', '5~'), ['(z|u|p|k|f|a)']));

        assert(exact(fill('a', 'C', '|'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']));
        assert(exact(fill('a', 'C', '~'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']));
      });
    });
  });

  describe('prefixes:', function() {
    describe('logical or:', function() {
      it('should add a prefix to a logical or when passed on the options:', function() {
        assert(exact(fill('c', 'a', '|', {regexPrefix: '?:'}), ['(?:c|b|a)']));
        assert(exact(fill('c', 'a', '~', {regexPrefix: '?:'}), ['(?:c|b|a)']));
        assert(exact(fill('1', '10', '|', {regexPrefix: '?!'}), ['(?!1|2|3|4|5|6|7|8|9|10)']));
      });
    });
    describe('character classes:', function() {
      it('should add a negation prefix to a character class:', function() {
        assert(exact(fill('a', 'c', '~', {regexPrefix: '^'}), ['[^a-c]']));
        assert(exact(fill('a', 'c', '~', {regexPrefix: '^'}), ['[^a-c]']));
        assert(exact(fill('a', 'c', '|', {regexPrefix: '^'}), ['[^a-c]']));
      });
      it('should not add the wrong prefix to a character class:', function() {
        assert(exact(fill('a', 'c', '~', {regexPrefix: '?!'}), ['[a-c]']));
        assert(exact(fill('a', 'c', '~', {regexPrefix: '?:'}), ['[a-c]']));
        assert(exact(fill('a', 'c', '|', {regexPrefix: 'foo'}), ['[a-c]']));
      });
    });
  });
});
