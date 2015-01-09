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

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `a` Start of the range
 * @param  {String} `b` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function fillRange(a, b, step, fn) {
  if (a == null || b == null) {
    throw new Error('fill-range expects the first and second args to be strings.');
  }

  if (typeof step === 'function') {
    fn = step;
    step = null;
  }

  var expand, sep = '';

  // store a ref to unmodified arg
  var origA = a;

  b = (b.toString() === '-0') ? 0 : b;

  // handle special step characters
  if (typeof step === 'string') {
    var match = /\?|>|\|/g.exec(step);
    var i = match && match.index;

    if (match && match[0] === '?') {
      return [randomize(a, b)];
    }

    if (match && match[0] === '>') {
      step = step.substr(0, i) + step.substr(i + 1);
      expand = true;
    }

    if (match && match[0] === '|') {
      step = step.substr(0, i) + step.substr(i + 1);
      expand = true;
      sep = '|';
    }
  }

  // validate arguments
  validateRange(a, b, step);

  var num = step && isNumber(step)
    ? Math.abs(step)
    : 1;

  // is the range alphabetical? or numeric?
  var isNum = isNumber(a);

  // if numeric coerce to an integer, otherwise
  // get the charCode to expand alpha ranges
  a = isNum ? +a : a.charCodeAt(0);
  b = isNum ? +b : b.charCodeAt(0);

  // is the pattern positive or negative?
  var isNegative = b < a;

  // detect padding
  var padding = isPadded(origA);
  var res, pad, arr = [];
  var ii = 0;

  while (isNegative ? (a >= b) : (a <= b)) {
    if (padding && isNum) {
      pad = padding(a);
    }

    // custom function
    if (typeof fn === 'function') {
      res = fn(a, isNum, pad, ii++);

    // letters
    } else if (!isNum) {
      res = String.fromCharCode(a);

    // numbers
    } else {
      var result = pad ? pad + a : a;
      if (pad && a.toString()[0] === '-') {
        result = '-' + pad + a.toString().slice(1);
      }
      res = result.toString();
    }

    // add result to the array
    arr.push(res);

    // increment or decrement
    if (isNegative) {
      a -= num;
    } else {
      a += num;
    }
  }

  return expand ? join(arr, sep) : arr;
}

/**
 * Join `arr` with the given `sep`
 */

function join(arr, sep) {
  var res = arr.join(sep);
  if (sep === '|') {
    res = '(' + res + ')';
  }
  return [res];
}

/**
 * Test for padding. Returns the actual padding string
 * or `false` if no padding.
 *
 * @param  {*} `origA` String or number.
 * @return {String|Boolean}
 */

function isPadded(origA) {
  if (/[^.]\.|^-*0+[1-9]/.exec(origA)) {
    return function (a) {
      return repeat('0', origA.toString().length - a.toString().length);
    };
  }
  return false;
}

/**
 * Handle errors
 */

function validateRange(a, b, step) {
  if (!/[\w\d]/.test(a) || !/[\w\d]/.test(b)) {
    throw new Error('fill-range: invalid range arguments.');
  }
  var isNumA = isNumber(a), isNumB = isNumber(b);
  if ((!isNumA && isNumB) || (isNumA && !isNumB)) {
    throw new TypeError('fill-range: first range argument is incompatible with second.');
  }
  if (step && (!isNumber(step) && !/>|\?|\|/.test(step))) {
    throw new TypeError('fill-range: invalid step.');
  }
}