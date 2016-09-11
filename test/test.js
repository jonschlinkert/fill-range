/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var range = require('..');

describe('error handling', function() {
  it('should throw when the first arg is not a string.', function() {
    assert.throws(function() {
      range();
    }, /fill-range expects the first and second args to be strings/);
  });

  it('should throw when range arguments are invalid and `silent` is false.', function() {
    assert.throws(function() {
      range('0a', '0z', {silent: false});
    }, /fill-range: invalid range arguments/);
    assert.throws(function() {
      range('!', '$', {silent: false});
    }, /fill-range: invalid range arguments/);
  });

  it('should throw when args are incompatible.', function() {
    assert.throws(function() {
      range('a', 10, {silent: false});
    }, /fill-range: first range argument is incompatible with second/);

    assert.throws(function() {
      range(1, 'z', {silent: false});
    }, /fill-range: first range argument is incompatible with second/);
  });

  it('should throw when the step is bad.', function() {
    assert.throws(function() {
      range('1', '10', 'z', {silent: false});
    }, /fill-range: invalid step/);
    assert.throws(function() {
      range('a', 'z', 'a', {silent: false});
    }, /fill-range: invalid step/);
    assert.throws(function() {
      range('a', 'z', '0a', {silent: false});
    }, /fill-range: invalid step/);
  });
});

describe('ranges: numbers', function() {
  it('should increment numerical ranges', function() {
    assert.deepEqual(range('1', '10'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(range('1', '3'), ['1', '2', '3']);
    assert.deepEqual(range('5', '8'), ['5', '6', '7', '8']);
    assert.deepEqual(range(1, '9'), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    assert.deepEqual(range(1, 3), ['1', '2', '3']);
    assert.deepEqual(range(1, 9), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    assert.deepEqual(range(5, 8), ['5', '6', '7', '8']);
  });

  it('should decrement numerical ranges', function() {
    assert.deepEqual(range('0', '-5'), ['0', '-1', '-2', '-3', '-4', '-5']);
    assert.deepEqual(range(-10, -1), ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
    assert.deepEqual(range(0, -5), ['0', '-1', '-2', '-3', '-4', '-5']);
  });

  it('should handle ranges ranges that are positive and negative:', function() {
    assert.deepEqual(range(9, -4), ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
    assert.deepEqual(range(-5, 5), ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5']);
  });
});

describe('ranges: letters', function() {
  it('should increment alphabetical ranges', function() {
    assert.deepEqual(range('a', 'e'), ['a', 'b', 'c', 'd', 'e']);
    assert.deepEqual(range('A', 'E'), ['A', 'B', 'C', 'D', 'E']);
  });

  it('should decrement alphabetical ranges', function() {
    assert.deepEqual(range('a', 'C'), ['a','`','_','^',']',"\\",'[','Z','Y','X','W','V','U','T','S','R','Q','P','O','N','M','L','K','J','I','H','G','F','E','D','C']);
    assert.deepEqual(range('E', 'A'), ['E', 'D', 'C', 'B', 'A']);
    assert.deepEqual(range('z', 'm'), ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm']);
  });
});

describe('steps: numbers', function() {
  it('should increment ranges using the given step', function() {
    assert.deepEqual(range('1', '10', '1'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(range('1', '10', '2'), ['1', '3', '5', '7', '9']);
    assert.deepEqual(range('0', '1000', '200'), ['0','200', '400', '600', '800', '1000']);
    assert.deepEqual(range('1', '10', 2), ['1', '3', '5', '7', '9']);
    assert.deepEqual(range('1', '20', '2'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    assert.deepEqual(range('1', '20', '20'), ['1']);
    assert.deepEqual(range('10', '1', '-2'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(range('10', '1', '2'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(range(2, 10, '2'), ['2', '4', '6', '8', '10']);
    assert.deepEqual(range(2, 10, 1), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(range(2, 10, 2), ['2', '4', '6', '8', '10']);
    assert.deepEqual(range(2, 10, 3), ['2', '5', '8']);
    assert.deepEqual(range(2, '10', '2'), ['2', '4', '6', '8', '10']);
    assert.deepEqual(range(2, '10', 1), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(range(2, '10', '2'), ['2', '4', '6', '8', '10']);
    assert.deepEqual(range('2', 10, '3'), ['2', '5', '8']);
  });

  it('should fill in negative ranges using the given step', function() {
    assert.deepEqual(range('-1', '-10', '-2'), ['-1', '-3', '-5', '-7', '-9']);
    assert.deepEqual(range('-1', '-10', '2'), ['-1', '-3', '-5', '-7', '-9']);
    assert.deepEqual(range('1', '10', '2'), ['1', '3', '5', '7', '9']);
    assert.deepEqual(range('1', '20', '2'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    assert.deepEqual(range('1', '20', '20'), ['1']);
    assert.deepEqual(range('10', '1', '-2'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(range(-10, -2, 2), ['-10', '-8', '-6', '-4', '-2']);
    assert.deepEqual(range(-2, -10, 1), ['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    assert.deepEqual(range(-2, -10, 2), ['-2', '-4', '-6', '-8', '-10']);
    assert.deepEqual(range(-2, -10, 3), ['-2', '-5', '-8']);
    assert.deepEqual(range(-9, 9, 3), ['-9', '-6', '-3', '0', '3', '6', '9']);
  });
});

describe('steps: letters', function() {
  it('should use increments with alphabetical ranges', function() {
    assert.deepEqual(range('a', 'e', 2), ['a','c', 'e']);
    assert.deepEqual(range('E', 'A', 2), ['E', 'C', 'A']);
  });
});

describe('options: step', function() {
  it('should use the step defined on the options:', function() {
    var opts = { step: 2 };
    assert.deepEqual(range('a', 'e', opts), ['a','c', 'e']);
    assert.deepEqual(range('E', 'A', opts), ['E', 'C', 'A']);
  });
});

describe('padding: numbers', function() {
  it('should pad numbers:', function() {
    assert.deepEqual(range('01', '03'), ['01', '02', '03']);
    assert.deepEqual(range('0001', '0003'), ['0001', '0002', '0003']);
    assert.deepEqual(range('-10', '00'), ['-10', '-09', '-08', '-07', '-06', '-05', '-04', '-03', '-02', '-01', '000']);
    assert.deepEqual(range('05', '100'), ['005','006','007','008','009','010','011','012','013','014','015','016','017','018','019','020','021','022','023','024','025','026','027','028','029','030','031','032','033','034','035','036','037','038','039','040','041','042','043','044','045','046','047','048','049','050','051','052','053','054','055','056','057','058','059','060','061','062','063','064','065','066','067','068','069','070','071','072','073','074','075','076','077','078','079','080','081','082','083','084','085','086','087','088','089','090','091','092','093','094','095','096','097','098','099','100']);
  });

  it('should pad numbers when a step is passed:', function() {
    assert.deepEqual(range('1', '05', '3'), ['01','04']);
    assert.deepEqual(range('1', '005', '3'), ['001','004']);
    assert.deepEqual(range('00', '1000', '200'), ['0000','0200', '0400', '0600', '0800', '1000']);
    assert.deepEqual(range('0', '01000', '200'), ['00000','00200', '00400', '00600', '00800', '01000']);
    assert.deepEqual(range('001', '5', '3'), ['001','004']);
    assert.deepEqual(range('02', '10', 2), ['02', '04', '06', '08', '10']);
    assert.deepEqual(range('002', '10', 2), ['002', '004', '006', '008', '010']);
    assert.deepEqual(range('002', '010', 2), ['002', '004', '006', '008', '010']);
    assert.deepEqual(range('-04', 4, 2), ['-04', '-02', '000', '002', '004']);
  });

  it('should return `null` for invalid ranges:', function() {
    assert.strictEqual(range('1.1', '2.1'), null);
    assert.strictEqual(range('1.2', '2'), null);
    assert.strictEqual(range('1.20', '2'), null);
    assert.strictEqual(range('1', '0f'), null);
    assert.strictEqual(range('1', '10', 'ff'), null);
    assert.strictEqual(range('1', '10.f'), null);
    assert.strictEqual(range('1', '10f'), null);
    assert.strictEqual(range('1', '20', '2f'), null);
    assert.strictEqual(range('1', '20', 'f2'), null);
    assert.strictEqual(range('1', '2f', '2'), null);
    assert.strictEqual(range('1', 'ff', '2'), null);
    assert.strictEqual(range('1', 'ff'), null);
    assert.strictEqual(range('1', 'f'), null);
    assert.strictEqual(range('f', '1'), null);
  });
});

describe('special cases', function() {
  it('should convert `-0` to `0`:', function() {
    assert.deepEqual(range('-5', '-0', '-1'), ['-5', '-4', '-3', '-2', '-1', '0']);
    assert.deepEqual(range('1', '-0', '2'), ['1']);
    assert.deepEqual(range('1', '-0', '0'), ['1', '0']);
  });

  it('should adjust padding for negative numbers:', function() {
    assert.deepEqual(range('-01', '5'), ['-01','000','001','002','003','004','005']);
  });
});

describe('special characters:', function() {
  it('should use the step defined on the options:', function() {
    var opts = { step: '~' };
    assert.deepEqual(range('a', 'e', opts), ['[a-e]']);
    assert.deepEqual(range('E', 'A', opts), ['(E|D|C|B|A)']);
  });

  describe('repeat:', function() {
    it('should repeat the first arg `n` times:', function() {
      assert.deepEqual(range('a', 3, '+'), ['a', 'a', 'a']);
      assert.deepEqual(range('abc', 2, '+'), ['abc', 'abc']);
    });
  });

  describe('join:', function() {
    it('should join values when `>` is passed:', function() {
      assert.deepEqual(range('a', 'e', '>'), ['abcde']);
      assert.deepEqual(range('A', 'E', '>'), ['ABCDE']);
      assert.deepEqual(range('E', 'A', '>'), ['EDCBA']);
      assert.deepEqual(range('5', '8', '>'), ['5678']);
    });

    it('should use steps with joined values:', function() {
      assert.deepEqual(range('A', 'Z', '>5'), ['AFKPUZ']);
      assert.deepEqual(range('2', '20', '2>'), ['2468101214161820']);
      assert.deepEqual(range('2', '20', '>2'), ['2468101214161820']);
    });
  });

  describe('randomize:', function() {
    it('should randomize using the first two args when `?` is passed:', function() {
      assert(/[\w\d]{5}/.test(range('A0', 5, '?')));
      assert(!/[\w\d]{6}/.test(range('A0', 5, '?')));
      assert(!/\d{5}/.test(range('A', 5, '?')));
      assert(/.{5}/.test(range('*', 5, '?')));
      assert(/[^\W]{10}/.test(range('aA0', 10, '?')));
    });
  });

  describe('regex string:', function() {
    it('should respect padding when special chars are used:', function() {
      assert.deepEqual(range('05', '100', '10'), ['005','015','025','035','045','055','065','075','085','095']);
      assert.deepEqual(range('05', '100', '10|'), ['(005|015|025|035|045|055|065|075|085|095)']);
      assert.deepEqual(range('05', '100', '|10'), ['(005|015|025|035|045|055|065|075|085|095)']);
      assert.deepEqual(range('05', '100', '10~'), ['(005|015|025|035|045|055|065|075|085|095)']);
    });

    it('should create a regex logical `or`:', function() {
      assert.deepEqual(range('c', 'a', '|'), ['(c|b|a)']);
      assert.deepEqual(range('z', 'a', '|5'), ['(z|u|p|k|f|a)']);
      assert.deepEqual(range('a', 'e', '2|'), ['(a|c|e)']);
      assert.deepEqual(range('a', 'e', '|2'), ['(a|c|e)']);
      assert.deepEqual(range('a', 'z', '|5'), ['(a|f|k|p|u|z)']);
      assert.deepEqual(range('a', 'C', '|'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']);
      assert.deepEqual(range('a', 'C', '~'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']);
    });

    it('should create a regex character class (range):', function() {
      assert.deepEqual(range('a', 'c', '|'), ['[a-c]']);
      assert.deepEqual(range('1', '3', '|'), ['[1-3]']);
    });

    it('should create a regex character class when `optimize` is true:', function() {
      assert.deepEqual(range('a', 'c', {optimize: true}), ['[a-c]']);
      assert.deepEqual(range('1', '3', {optimize: true}), ['[1-3]']);
    });

    it('should not create a regex character class when `optimize` is false:', function() {
      assert.deepEqual(range('a', 'c', {optimize: false}), ['a', 'b', 'c']);
      assert.deepEqual(range('1', '3', {optimize: false}), ['1', '2', '3']);
    });

    it('should not create a regex character class for negative numbers:', function() {
      assert.deepEqual(range('-1', '2'), ['-1', '0', '1', '2']);
      assert.deepEqual(range('-1', '2', '~'), ['-1', '0', '1', '2']);
      assert.deepEqual(range('0', '-2'), ['0', '-1', '-2']);
      assert.deepEqual(range('0', '-2', '~'), ['0', '-1', '-2']);
    });

    it('should not wrap a single value:', function() {
      assert.deepEqual(range(1, 1, '~'), ['1']);
      assert.deepEqual(range('e', 'e', '~'), ['e']);
    });

    it('when a step is zero it should be coerced to a one:', function() {
      assert.deepEqual(range('a', 'e', '0'), ['a', 'b', 'c', 'd', 'e']);
      assert.deepEqual(range('a', 'e', '0|'), ['[a-e]']);
      assert.deepEqual(range('a', 'e', '~0'), ['[a-e]']);
      assert.deepEqual(range('a', 'e', '|0'), ['[a-e]']);
    });
  });
});

describe('syntax detection:', function() {
  describe('should determine the correct syntax to avoid creating out-of-order ranges:', function() {
    it('should create valid character classes for numbers:', function() {
      assert.deepEqual(range(1, 3, '~'), ['[1-3]']);
      assert.deepEqual(range(1, 3, '~1'), ['[1-3]']);
      assert.deepEqual(range(1, 3, '|'), ['[1-3]']);
      assert.deepEqual(range(1, 3, '|1'), ['[1-3]']);

      assert.deepEqual(range('1', '3', '|'), ['[1-3]']);
      assert.deepEqual(range('1', '3', '|1'), ['[1-3]']);
      assert.deepEqual(range('1', '3', '~'), ['[1-3]']);
      assert.deepEqual(range('1', '3', '~1'), ['[1-3]']);

      assert.deepEqual(range('0', '9', '|'), ['[0-9]']);
      assert.deepEqual(range('0', '9', '~'), ['[0-9]']);
    });

    it('should create valid logical `or`s for descending numbers:', function() {
      assert.deepEqual(range('5', '1', '|'), ['(5|4|3|2|1)']);
      assert.deepEqual(range('5', '1', '~'), ['(5|4|3|2|1)']);
      assert.deepEqual(range('3', '1', '~1'), ['(3|2|1)']);
      assert.deepEqual(range('3', '1', '~|'), ['(3|2|1)']);
    });

    it('should create valid character classes for letters:', function() {
      assert.deepEqual(range('a', 'c', '~'), ['[a-c]']);
      assert.deepEqual(range('a', 'c', '|'), ['[a-c]']);
      assert.deepEqual(range('a', 'z', '~'), ['[a-z]']);
      assert.deepEqual(range('a', 'z', '|'), ['[a-z]']);
    });

    it('should create valid logical `or`s for numbers:', function() {
      assert.deepEqual(range('1', '10', '~'), ['(1|2|3|4|5|6|7|8|9|10)']);
      assert.deepEqual(range('10', '11', '~'), ['(10|11)']);
      assert.deepEqual(range('10', '11', '|'), ['(10|11)']);
      assert.deepEqual(range('11', '10', '~'), ['(11|10)']);
      assert.deepEqual(range('11', '10', '|'), ['(11|10)']);
      assert.deepEqual(range(10, 20, '|'), ['(10|11|12|13|14|15|16|17|18|19|20)']);
      assert.deepEqual(range(10, 20, '~'), ['(10|11|12|13|14|15|16|17|18|19|20)']);
      assert.deepEqual(range(9, 9, '|'), ['9']);
    });

    it('should create valid logical `or`s for letters:', function() {
      assert.deepEqual(range('c', 'a', '|'), ['(c|b|a)']);
      assert.deepEqual(range('c', 'a', '~'), ['(c|b|a)']);

      assert.deepEqual(range('a', 'z', '5~'), ['(a|f|k|p|u|z)']);
      assert.deepEqual(range('a', 'z', '5~'), ['(a|f|k|p|u|z)']);

      assert.deepEqual(range('z', 'a', '5|'), ['(z|u|p|k|f|a)']);
      assert.deepEqual(range('z', 'a', '5~'), ['(z|u|p|k|f|a)']);

      assert.deepEqual(range('a', 'C', '|'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']);
      assert.deepEqual(range('a', 'C', '~'), ['(a|_|Z|Y|X|W|V|U|T|S|R|Q|P|O|N|M|L|K|J|I|H|G|F|E|D|C)']);
    });
  });
});

describe('prefixes:', function() {
  describe('logical or:', function() {
    it('should add a prefix to a logical or when passed on the options:', function() {
      assert.deepEqual(range('c', 'a', '|', {regexPrefix: '?:'}), ['(?:c|b|a)']);
      assert.deepEqual(range('c', 'a', '~', {regexPrefix: '?:'}), ['(?:c|b|a)']);
      assert.deepEqual(range('1', '10', '|', {regexPrefix: '?!'}), ['(?!1|2|3|4|5|6|7|8|9|10)']);
    });
  });
  describe('character classes:', function() {
    it('should add a negation prefix to a character class:', function() {
      assert.deepEqual(range('a', 'c', '~', {regexPrefix: '^'}), ['[^a-c]']);
      assert.deepEqual(range('a', 'c', '~', {regexPrefix: '^'}), ['[^a-c]']);
      assert.deepEqual(range('a', 'c', '|', {regexPrefix: '^'}), ['[^a-c]']);
    });
    it('should not add the wrong prefix to a character class:', function() {
      assert.deepEqual(range('a', 'c', '~', {regexPrefix: '?!'}), ['[a-c]']);
      assert.deepEqual(range('a', 'c', '~', {regexPrefix: '?:'}), ['[a-c]']);
      assert.deepEqual(range('a', 'c', '|', {regexPrefix: 'foo'}), ['[a-c]']);
    });
  });
});

describe('custom function for expansions:', function() {
  it('should expose the current value as the first param.', function() {
    var arr = range(1, 5, function(val, isNumber, padding, i) {
      return val;
    });
    assert.deepEqual(arr, [1, 2, 3, 4, 5]);
  });

  it('should expose the `isNumber` boolean as the second param.', function() {
    var arr = range('a', 'e', function(val, isNumber, padding, i) {
      if (!isNumber) {
        return String.fromCharCode(val);
      }
      return val;
    });
    assert.deepEqual(arr, ['a', 'b', 'c', 'd', 'e']);
  });

  it('should expose padding as the third param.', function() {
    var arr = range('01', '05', function(val, isNumber, padding, i) {
      return padding + padding + val;
    });
    assert.deepEqual(arr, ['001', '002', '003', '004', '005']);
  });

  it('should expose the index as the fourth param.', function() {
    var arr = range('a', 'e', function(val, isNumber, padding, i) {
      if (!isNumber) {
        return String.fromCharCode(val) + i;
      }
      return val;
    });
    assert.deepEqual(arr, ['a0', 'b1', 'c2', 'd3', 'e4']);
  });
});
