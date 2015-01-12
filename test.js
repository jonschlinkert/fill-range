/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var range = require('./');

describe('error handling', function () {
  it('should throw when the first arg is not a string.', function () {
    (function() {
      range();
    }).should.throw('fill-range expects the first and second args to be strings.');
  });

  it('should throw when range arguments are invalid.', function () {
    (function() {range('0a', '0z'); }).should.throw('fill-range: invalid range arguments.');
    (function() {range('!', '$'); }).should.throw('fill-range: invalid range arguments.');
  });

  it('should throw when args are incompatible.', function () {
    (function() {
      range('a', 10);
    }).should.throw('fill-range: first range argument is incompatible with second.');

    (function() {
      range(1, 'z');
    }).should.throw('fill-range: first range argument is incompatible with second.');
  });

  it('should throw when the step is bad.', function () {
    (function() {range('1', '10', 'z'); }).should.throw('fill-range: invalid step.');
    (function() {range('a', 'z', 'a'); }).should.throw('fill-range: invalid step.');
    (function() {range('a', 'z', '0a'); }).should.throw('fill-range: invalid step.');
  });
});

describe('ranges: numbers', function () {
  it('should increment numerical ranges', function () {
    range('1', '10').should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    range('1', '3').should.eql(['1', '2', '3']);
    range('5', '8').should.eql(['5', '6', '7', '8']);
    range(1, '9').should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    range(1, 3).should.eql(['1', '2', '3']);
    range(1, 9).should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    range(5, 8).should.eql(['5', '6', '7', '8']);
  });

  it('should decrement numerical ranges', function () {
    range('0', '-5').should.eql(['0', '-1', '-2', '-3', '-4', '-5']);
    range(-10, -1).should.eql(['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
    range(0, -5).should.eql(['0', '-1', '-2', '-3', '-4', '-5']);
  });

  it('should handle ranges ranges that are positive and negative:', function () {
    range(9, -4).should.eql(['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
    range(-5, 5).should.eql(['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5']);
  });
});

describe('ranges: letters', function () {
  it('should increment alphabetical ranges', function () {
    range('a', 'e').should.eql(['a', 'b', 'c', 'd', 'e']);
    range('A', 'E').should.eql(['A', 'B', 'C', 'D', 'E']);
  });

  it('should decrement alphabetical ranges', function () {
    range('E', 'A').should.eql(['E', 'D', 'C', 'B', 'A']);
    range('z', 'm').should.eql(['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm']);
  });
});

describe('steps: numbers', function () {
  it('should increment ranges using the given step', function () {
    range('1', '10', '1').should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    range('1', '10', '2').should.eql(['1', '3', '5', '7', '9']);
    range('1', '10', '2').should.eql(['1', '3', '5', '7', '9']);
    range('1', '10', 2).should.eql(['1', '3', '5', '7', '9']);
    range('1', '20', '2').should.eql(['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    range('1', '20', '20').should.eql(['1']);
    range('10', '1', '-2').should.eql(['10', '8', '6', '4', '2']);
    range('10', '1', '2').should.eql(['10', '8', '6', '4', '2']);
    range(2, 10, '2').should.eql(['2', '4', '6', '8', '10']);
    range(2, 10, 1).should.eql(['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    range(2, 10, 2).should.eql(['2', '4', '6', '8', '10']);
    range(2, 10, 3).should.eql(['2', '5', '8']);
    range(2, '10', '2').should.eql(['2', '4', '6', '8', '10']);
    range(2, '10', 1).should.eql(['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    range(2, '10', '2').should.eql(['2', '4', '6', '8', '10']);
    range('2', 10, '3').should.eql(['2', '5', '8']);
  });

  it('should fill in negative ranges using the given step', function () {
    range('-1', '-10', '-2').should.eql(['-1', '-3', '-5', '-7', '-9']);
    range('-1', '-10', '2').should.eql(['-1', '-3', '-5', '-7', '-9']);
    range('10', '1', '-2').should.eql(['10', '8', '6', '4', '2']);
    range(-10, -2, 2).should.eql(['-10', '-8', '-6', '-4', '-2']);
    range(-2, -10, 1).should.eql(['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    range(-2, -10, 2).should.eql(['-2', '-4', '-6', '-8', '-10']);
    range(-2, -10, 3).should.eql(['-2', '-5', '-8']);
    range(-9, 9, 3).should.eql(['-9', '-6', '-3', '0', '3', '6', '9']);
  });

  it('should fill in negative ranges using the given step', function () {
    range('1', '10', '2').should.eql(['1', '3', '5', '7', '9']);
    range('-1', '-10', '2').should.eql(['-1', '-3', '-5', '-7', '-9']);
    range('-1', '-10', '-2').should.eql(['-1', '-3', '-5', '-7', '-9']);
    range('1', '20', '2').should.eql(['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    range('1', '20', '20').should.eql(['1']);
  });
});

describe('steps: letters', function () {
  it('should use increments with alphabetical ranges', function () {
    range('a', 'e', 2).should.eql(['a','c', 'e']);
    range('E', 'A', 2).should.eql(['E', 'C', 'A']);
  });
});

describe('padding: numbers', function () {
  it('should pad numbers:', function () {
    range('01', '03').should.eql(['01', '02', '03']);
    range('0001', '0003').should.eql(['0001', '0002', '0003']);
    range('-10', '00').should.eql(['-10', '-09', '-08', '-07', '-06', '-05', '-04', '-03', '-02', '-01', '000']);
    range('05', '100').should.eql(['005','006','007','008','009','010','011','012','013','014','015','016','017','018','019','020','021','022','023','024','025','026','027','028','029','030','031','032','033','034','035','036','037','038','039','040','041','042','043','044','045','046','047','048','049','050','051','052','053','054','055','056','057','058','059','060','061','062','063','064','065','066','067','068','069','070','071','072','073','074','075','076','077','078','079','080','081','082','083','084','085','086','087','088','089','090','091','092','093','094','095','096','097','098','099','100']);
    range('1', '05').should.eql(['01','02','03','04','05']);
  });

  it('should pad numbers when a step is passed:', function () {
    range('1', '05', '3').should.eql(['01','04']);
    range('02', '10', 2).should.eql(['02', '04', '06', '08', '10']);
    range('002', '10', 2).should.eql(['002', '004', '006', '008', '010']);
    range('002', '010', 2).should.eql(['002', '004', '006', '008', '010']);
    range('-04', 4, 2).should.eql(['-04', '-02', '000', '002', '004']);
  });
});

describe('special cases', function () {
  it('should convert `-0` to `0`:', function () {
    range('-5', '-0', '-1').should.eql(['-5', '-4', '-3', '-2', '-1', '0']);
  });

  it('should adjust padding for negative numbers:', function () {
    range('-01', '5').should.eql(['-01','000','001','002','003','004','005']);
  });
});

describe('special characters:', function () {
  it('should repeat the first arg `n` times:', function () {
    range('a', 3, '+').should.eql(['a', 'a', 'a']);
    range('abc', 2, '+').should.eql(['abc', 'abc']);
  });

  it('should collapse values when `>` is passed:', function () {
    range('a', 'e', '>').should.eql(['abcde']);
    range('A', 'E', '>').should.eql(['ABCDE']);
    range('E', 'A', '>').should.eql(['EDCBA']);
    range('5', '8', '>').should.eql(['5678']);
    range('2', '20', '2>').should.eql(['2468101214161820']);
    range('2', '20', '>2').should.eql(['2468101214161820']);
  });

  it('should randomize using the first two args when `?` is passed:', function () {
    range('A0', 5, '?').should.match(/[\w\d]{5}/);
    range('A0', 5, '?').should.not.match(/[\w\d]{6}/);
    range('A', 5, '?').should.not.match(/\d{5}/);
    range('*', 5, '?').should.match(/.{5}/);
    range('aA0', 10, '?').should.match(/[^\W]{10}/);
  });

  it('should join the array using `|` as the separator:', function () {
    range('a', 'c', '|').should.eql(['(a|b|c)']);
    range('a', 'e', '2|').should.eql(['(a|c|e)']);
    range('a', 'e', '|2').should.eql(['(a|c|e)']);
  });
});

describe('custom function for expansions:', function () {
  it('should expose the current value as the first param.', function () {
    range(1, 5, function (val, isNumber, padding, i) {
      return val;
    }).should.eql([1, 2, 3, 4, 5]);
  });

  it('should expose the `isNumber` boolean as the second param.', function () {
    range('a', 'e', function (val, isNumber, padding, i) {
      if (!isNumber) {
        return String.fromCharCode(val);
      }
      return val;
    }).should.eql(['a', 'b', 'c', 'd', 'e']);
  });

  it('should expose padding as the third param.', function () {
    range('01', '05', function (val, isNumber, padding, i) {
      return padding + padding + val;
    }).should.eql(['001', '002', '003', '004', '005']);
  });

  it('should expose the index as the fourth param.', function () {
    range('a', 'e', function (val, isNumber, padding, i) {
      if (!isNumber) {
        return String.fromCharCode(val) + i;
      }
      return val;
    }).should.eql(['a0', 'b1', 'c2', 'd3', 'e4']);
  });
});
