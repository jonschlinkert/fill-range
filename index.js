/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var isNumber = require('is-number');
var randomize = require('randomatic');
var repeatStr = require('repeat-string');
var repeat = require('repeat-element');

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
  var origB = b;

  b = (b.toString() === '-0') ? 0 : b;

  // handle special step characters
  if (typeof step === 'string') {
    var match = stepRe().exec(step);
    var i = match && match.index;

    if (match && match[0] === '+') {
      return repeat(a, b);

    } else if (match && match[0] === '?') {
      return [randomize(a, b)];

    } else if (match && match[0] === '>') {
      step = step.substr(0, i) + step.substr(i + 1);
      expand = true;

    } else if (match && match[0] === '|') {
      step = step.substr(0, i) + step.substr(i + 1);
      expand = true;
      sep = '|';

    }

    if (!match && !isNumber(step)) {
      throw new TypeError('fill-range: invalid step.');
    }
  }

  if (!hasEither(a) || !hasEither(b) || hasBoth(a) || hasBoth(b)) {
    throw new Error('fill-range: invalid range arguments.');
  }

  // validate arguments
  var isNumA = isNumber(zeros(a));
  var isNumB = isNumber(zeros(b));

  if ((!isNumA && isNumB) || (isNumA && !isNumB)) {
    throw new TypeError('fill-range: first range argument is incompatible with second.');
  }

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
  var padding = isPadded(origA, origB);
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
 * Step regex
 */

function stepRe() {
  return /\?|>|\||\+/g;
}

/**
 * Return true if `val` has either a letter
 * or a number
 */

function hasEither(val) {
  return /[a-z0-9]/i.test(val);
}

/**
 * Return true if `val` has both a letter and
 * a number (invalid)
 */

function hasBoth(val) {
  return /[a-z][0-9]|[0-9][a-z]/i.test(val);
}

/**
 * Normalize zeros for checks
 */

function zeros(val) {
  if (/^-*0+$/.test(val)) {
    return '0';
  }
  return val;
}

/**
 * Return true if `val` has leading zeros,
 * or a similar valid pattern.
 */

function hasZeros(val) {
  return /[^.]\.|^-*0+[0-9]/.test(val);
}

/**
 * Test for padding. Returns the actual padding string
 * or `false` if no padding.
 *
 * @param  {*} `origA` String or number.
 * @return {String|Boolean}
 */

function isPadded(origA, origB) {
  if (hasZeros(origA) || hasZeros(origB)) {
    var alen = length(origA);
    var blen = length(origB);
    var len = alen >= blen ? alen : blen;
    return function (a) {
      return repeatStr('0', len - length(a));
    };
  }
  return false;
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
 * Get the string length of `val`
 */

function length(val) {
  return val.toString().length;
}
