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


function fillRange(a, b, step, fn) {
  if (typeof step === 'function') {
    fn = step;
    step = null;
  }

  validateRange(a, b, step);

  // Was a step defined?
  step = step
    ? Math.abs(step)
    : 1;

  // store a ref to the unmodified first arg
  var strA = a.toString();

  // is the range alphabetical? or numeric?
  var isLetter = !isNumber(a);

  a = isLetter ? a.charCodeAt(0) : +a;
  b = isLetter ? b.charCodeAt(0) : +b;

  // is the pattern positive or negative?
  var isNegative = b < a;

  // detect padding
  var padding = isPadded(strA, isLetter);
  var res, pad, arr = [];
  var i = 0;

  while (isNegative ? (a >= b) : (a <= b)) {
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

    if (isNegative) {
      a -= step;
    } else {
      a += step;
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

function validateRange(a, b, step) {
  if (!/[\w\d]/.test(a) || !/[\w\d]/.test(b)) {
    throw new Error('fill-range: invalid range arguments.');
  }
  if (!isNumber(a) && isNumber(b)) {
    throw new TypeError('fill-range: incompatible range arguments.');
  }
  if (isNumber(a) && !isNumber(b)) {
    throw new TypeError('fill-range: incompatible range arguments.');
  }
  if (step && !isNumber(step)) {
    throw new TypeError('fill-range: invalid step.');
  }
}