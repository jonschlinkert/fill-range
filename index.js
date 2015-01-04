/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var randomize = require('randomatic');
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

  var expand;
  if (typeof step === 'string') {
    if (/\?/.test(step)) {
      return [randomize(a, b)];
    }

    if (/>/.test(step)) {
      step = step.replace(/>/, '');
      expand = true;
    }
  }

  validateRange(a, b, step);

  var num = step && isNumber(step)
    ? Math.abs(step)
    : 1;

  // store a ref to the unmodified first arg
  var strA = a.toString();

  // is the range alphabetical? or numeric?
  var isNumeric = isNumber(a);

  // if numeric coerce to an integer, otherwise
  // get the charCode to expand alpha ranges
  a = isNumeric ? +a : a.charCodeAt(0);
  b = isNumeric ? +b : b.charCodeAt(0);

  // is the pattern positive or negative?
  var isNegative = b < a;

  // detect padding
  var padding = isPadded(strA, isNumeric);
  var res, pad, arr = [];
  var i = 0;

  while (isNegative ? (a >= b) : (a <= b)) {
    if (padding && isNumeric) {
      pad = padding(a);
    }

    if (typeof fn === 'function') {
      res = fn(a, isNumeric, pad, i++);
    } else if (!isNumeric) {
      res = String.fromCharCode(a);
    } else {
      res = String(pad ? pad + a : a);
    }

    arr.push(res);

    if (isNegative) {
      a -= num;
    } else {
      a += num;
    }
  }

  return expand ? [arr.join('')] : arr;
}

function isPadded(strA, isNumeric) {
  return isNumeric && /^-*0+[1-9]/.test(strA)
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
  if (step && (!isNumber(step) && !/>/.test(step))) {
    throw new TypeError('fill-range: invalid step.');
  }
}