/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var repeat = require('repeat-string');
var isNumber = require('is-number');

/**
 * Expose `fillRange`
 */

module.exports = fillRange;


function fillRange(a, b, increment, fn) {
  if (typeof increment === 'function') {
    fn = increment;
    increment = undefined;
  }

  var invalid = (/\./.test(a) || /\./.test(b))
    || (increment && !isNumber(increment))
    || (!isNumber(Math.abs(a)) && isNumber(Math.abs(b)))
    || (isNumber(Math.abs(a)) && !isNumber(Math.abs(b)));

  if (invalid) {
    return {invalid: [a, b, increment].filter(Boolean).join('..')};
  }

  var astr = a.toString();
  var bstr = b.toString();
  var padding;

  // Was an increment (step) passed?
  increment = typeof increment !== 'undefined'
    ? Math.abs(increment)
    : 1;

  // is the range alphabetical? or numeric?
  var isLetter = !isNumber(a);
  a = isLetter ? a.charCodeAt(0) : +a;
  b = isLetter ? b.charCodeAt(0) : +b;

  if (!isLetter) {
    padding = isPadded(a, b);
  }


  function positiveRange(a, b, increment, fn, isLetter) {
    var arr = [];
    var pad = '';
    var i = 0;
    var res;

    while (a <= b) {
      // var pad = !isLetter ? String(repeat('0', padding)) : '';
      // if (padding && !res && !isLetter) {
      //   a = pad + a;
      // }

      if (typeof fn === 'function') {
        res = fn(a, isLetter, pad, i++);
      } else if (isLetter) {
        res = String.fromCharCode(a);
      } else {
        res = String(a);
      }

      arr.push(res);
      a += increment;
    }
    return arr;
  }

  function negativeRange(a, b, increment, fn, isLetter) {
    var arr = [];
    var pad = '';
    var i = 0;
    var res;

    while (a >= b) {
      // var pad = !isLetter ? String(repeat('0', padding)) : '';
      // if (padding && !res && !isLetter) {
      //   a = pad + a;
      // }

      if (typeof fn === 'function') {
        res = fn(a, isLetter, pad, i++);
      } else if (isLetter) {
        res = String.fromCharCode(a);
      } else {
        res = String(a);
      }

      arr.push(res);
      a -= increment;
    }
    return arr;
  }

  function isPadded(a, b, isLetter) {
    var res = /^-*(0*)[0-9]/.exec(astr);
    var len = res && res[1].length;
    if (!!(res && len > 0)) {
      return len;
    }

    return false;
  }

  function expand(a, b, increment, fn) {
    if (b < a) {
      return negativeRange(a, b, increment, fn, isLetter, padding);
    }
    return positiveRange(a, b, increment, fn, isLetter, padding);
  }

  return expand(a, b, increment, fn)
}