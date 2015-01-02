/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
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

  validateRange(a, b, increment);

  // Was an increment (step) passed?
  increment = typeof increment !== 'undefined'
    ? Math.abs(increment)
    : 1;

  var strA = a.toString();

  // is the range alphabetical? or numeric?
  var isLetter = !isNumber(a);
  a = isLetter ? a.charCodeAt(0) : +a;
  b = isLetter ? b.charCodeAt(0) : +b;

  var padding = isPadded(strA, isLetter);
  var res, pad, arr = [];
  var reverse = b < a;
  var i = 0;

  while (reverse ? (a >= b) : (a <= b)) {
    if (padding && !isLetter) {
      pad = padding(a);
    }

    if (typeof fn === 'function') {
      res = fn(a, isLetter, pad, i++);
    } else if (isLetter) {
      res = String.fromCharCode(a);
    } else {
      res = String(pad ? pad + a : a);
    }

    arr.push(res);

    if (reverse) {
      a -= increment
    } else {
      a += increment;
    }
  }
  return arr;
}

function isPadded(strA, isLetter) {
  return !isLetter && /^-*0+[1-9]/.test(strA)
    ? function (a) {
      var num = strA.length - a.toString().length;
      return repeat('0', num);
    } : false;
}

function validateRange(a, b, increment) {
  if (!/[\w\d]/.test(a) || !/[\w\d]/.test(b)) {
    throw new Error('fill-range: invalid range arguments.');
  }
  if (!isNumber(a) && isNumber(b)) {
    throw new TypeError('fill-range: incompatible range arguments.');
  }
  if (isNumber(a) && !isNumber(b)) {
    throw new TypeError('fill-range: incompatible range arguments.');
  }
  if (increment && !isNumber(increment)) {
    throw new TypeError('fill-range: invalid increment.');
  }
}