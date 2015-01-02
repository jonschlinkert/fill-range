/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var range = require('./');

describe('fill range', function () {
  it('should fill in numerical ranges', function () {
    range(1, 3).should.eql(['1', '2', '3']);
    range(5, 8).should.eql(['5', '6', '7', '8']);
  });

  it('should fill in numerical ranges when numbers are passed as strings', function () {
    range('1', '3').should.eql(['1', '2', '3']);
    range('5', '8').should.eql(['5', '6', '7', '8']);
  });

  it('should pad numbers:', function () {
    range('01', '03').should.eql(['01', '02', '03']);
    range('02', '10', 2).should.eql(['02', '04', '06', '08', '10']);
    range('0001', '0003').should.eql(['0001', '0002', '0003'])
  });

  it('should fill in negative ranges', function () {
    range('0', '-5').should.eql([ '0', '-1', '-2', '-3', '-4', '-5' ]);
    range(0, -5).should.eql([ '0', '-1', '-2', '-3', '-4', '-5' ]);
    range(9, -4).should.eql([ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ]);
    range(-10, -1).should.eql([ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ]);
  });

  it('should fill in ranges using the given increment', function () {
    range('1', '10').should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    range('1', '10', '1').should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    range('1', '10', '2').should.eql([ '1', '3', '5', '7', '9' ]);
    range('1', '10', '2').should.eql([ '1', '3', '5', '7', '9' ]);
    range('1', '10', 2).should.eql([ '1', '3', '5', '7', '9' ]);
    range('1', '20', '2').should.eql([ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ]);
    range('1', '20', '20').should.eql([ '1' ]);
    range('10', '1', '-2').should.eql([ '10', '8', '6', '4', '2' ]);
    range('10', '1', '2').should.eql([ '10', '8', '6', '4', '2' ]);
    range(1, 9).should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]);
    range(2, 10, '2').should.eql([ '2', '4', '6', '8', '10' ]);
    range(2, 10, 1).should.eql([ '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    range(2, 10, 2).should.eql([ '2', '4', '6', '8', '10' ]);
    range(2, 10, 3).should.eql([ '2', '5', '8' ]);
    range(1, '9').should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]);
    range(2, '10', '2').should.eql([ '2', '4', '6', '8', '10' ]);
    range(2, '10', 1).should.eql([ '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    range(2, '10', '2').should.eql([ '2', '4', '6', '8', '10' ]);
    range('2', 10, '3').should.eql([ '2', '5', '8' ]);
  });

  it('should fill in negative ranges using the given increment', function () {
    range('-1', '-10', '-2').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    range('-1', '-10', '2').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    range('10', '1', '-2').should.eql([ '10', '8', '6', '4', '2' ]);
    range(-10, -2, 2).should.eql([ '-10', '-8', '-6', '-4', '-2' ]);
    range(-2, -10, 1).should.eql([ '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10' ]);
    range(-2, -10, 2).should.eql([ '-2', '-4', '-6', '-8', '-10' ]);
    range(-2, -10, 3).should.eql([ '-2', '-5', '-8' ]);
    range(-9, 9, 3).should.eql([ '-9', '-6', '-3', '0', '3', '6', '9' ]);
  });

  it('should fill in negative ranges using the given increment', function () {
    range('1', '10', '2').should.eql([ '1', '3', '5', '7', '9' ]);
    range('-1', '-10', '2').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    range('-1', '-10', '-2').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    range('1', '20', '2').should.eql([ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ]);
    range('1', '20', '20').should.eql([ '1' ]);
  });

  it('should fill in alphabetical ranges', function () {
    range('a', 'e').should.eql(['a', 'b', 'c', 'd', 'e']);
    range('A', 'E').should.eql(['A', 'B', 'C', 'D', 'E']);
    range('E', 'A').should.eql(['E', 'D', 'C', 'B', 'A']);
  });

  it('should use increments with alphabetical ranges', function () {
    range('a', 'e', 2).should.eql(['a','c', 'e']);
    range('E', 'A', 2).should.eql(['E', 'C', 'A']);
  });

  describe('when a custom function is used for expansions', function () {
    it('should expose the current value as the first param.', function () {
      var res = range(1, 5, function (val, isNumeric, padding, i) {
        return val;
      });
      res.should.eql([1, 2, 3, 4, 5]);
    });

    it('should expose the `isNumeric` boolean as the second param.', function () {
      var res = range('a', 'e', function (val, isNumeric, padding, i) {
        if (!isNumeric) {
          return String.fromCharCode(val);
        }
        return val;
      });
      res.should.eql(['a', 'b', 'c', 'd', 'e']);
    });

    it('should expose padding as the third param.', function () {
      var res = range('01', '05', function (val, isNumeric, padding, i) {
        return padding + padding + val;
      });
      res.should.eql(['001', '002', '003', '004', '005']);
    });

    it('should expose the index as the fourth param.', function () {
      var res = range('a', 'e', function (val, isNumeric, padding, i) {
        if (!isNumeric) {
          return String.fromCharCode(val) + i;
        }
        return val;
      });
      res.should.eql(['a0', 'b1', 'c2', 'd3', 'e4']);
    });
  });
});
