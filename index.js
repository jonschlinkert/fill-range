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

  // store a ref to unmodified args
  var strA = a.toString();
  var strB = b.toString();

  var expand;
  b = (b.toString() === '-0') ? 0 : b;

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

  // is the range alphabetical? or numeric?
  var isNumeric = isNumber(a);

  // if numeric coerce to an integer, otherwise
  // get the charCode to expand alpha ranges
  a = isNumeric ? +a : a.charCodeAt(0);
  b = isNumeric ? +b : b.charCodeAt(0);

  // is the pattern positive or negative?
  var isNegative = b < a;

  // detect padding
  var padding = isPadded(strA, strB);
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

function isPadded(strA, strB) {
  if ((!/[^.]\./.test(strA) || !/[^.]\./.test(strB)) && /^-*0+[1-9]/.test(strA)) {
    return function (a) {
      return repeat('0', strA.length - a.toString().length);
    }
  }
  return false;
}

function validateRange(a, b, step) {
  if (!/[\w\d]/.test(a) || !/[\w\d]/.test(b)) {
    throw new Error('fill-range: invalid range arguments.');
  }
  if (!isNumber(a) && isNumber(b)) {
    throw new TypeError('fill-range: first range argument is incompatible with second.');
  }
  if (isNumber(a) && !isNumber(b)) {
    throw new TypeError('fill-range: first range argument is incompatible with second.');
  }
  if (step && (!isNumber(step) && !/>/.test(step))) {
    throw new TypeError('fill-range: invalid step.');
  }
}