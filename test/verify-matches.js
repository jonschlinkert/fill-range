/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var expand = require('./support/expand');
var exact = require('./support/exact');
var fill = require('..');
var count = 0;

function toRegex() {
  var str = fill.apply(null, arguments);
  return new RegExp('^(' + str + ')$');
}
function matcher() {
  var regex = toRegex.apply(null, arguments);
  return function(num) {
    return regex.test(String(num));
  };
}

function verifyRange(min, max, from, to) {
  var fn = matcher(min, max, {makeRe: true});
  var range = expand(from, to);
  var len = range.length, i = -1;

  while (++i < len) {
    var num = range[i];
    if (min <= num && num <= max) {
      assert(fn(num));
    } else {
      assert(!fn(num));
    }
    count++;
  }
}

describe('validate ranges', function() {
  after(function() {
    var num = (+(+(count).toFixed(2))).toLocaleString();
    console.log();
    console.log('   ', num, 'patterns tested');
  });

  it('should support equal numbers:', function() {
    verifyRange(1, 1, 0, 100);
    verifyRange(65443, 65443, 65000, 66000);
    verifyRange(192, 1000, 0, 1000);
  });

  it('should support large numbers:', function() {
    verifyRange(100019999300000, 100020000300000, 100019999999999, 100020000100000);
  });

  it('should support repeated digits:', function() {
    verifyRange(10331, 20381, 0, 99999);
  });

  it('should support repeated zeros:', function() {
    verifyRange(10031, 20081, 0, 59999);
    verifyRange(10000, 20000, 0, 59999);
  });

  it('should support zero one:', function() {
    verifyRange(10301, 20101, 0, 99999);
  });

  it('should support repetead ones:', function() {
    verifyRange(102, 111, 0, 1000);
  });

  it('should support small diffs:', function() {
    verifyRange(102, 110, 0, 1000);
    verifyRange(102, 130, 0, 1000);
  });

  it('should support random ranges:', function() {
    verifyRange(4173, 7981, 0, 99999);
  });

  it('should support one digit numbers:', function() {
    verifyRange(3, 7, 0, 99);
  });

  it('should support one digit at bounds:', function() {
    verifyRange(1, 9, 0, 1000);
  });

  it('should support power of ten:', function() {
    verifyRange(1000, 8632, 0, 99999);
  });

  it('should work with numbers of varying lengths:', function() {
    verifyRange(1030, 20101, 0, 99999);
    verifyRange(13, 8632, 0, 10000);
  });

  it('should support small ranges:', function() {
    verifyRange(9, 11, 0, 100);
    verifyRange(19, 21, 0, 100);
  });

  it('should support big ranges:', function() {
    verifyRange(90, 98009, 0, 98999);
    verifyRange(999, 10000, 1, 20000);
  });
});

