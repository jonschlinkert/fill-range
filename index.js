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

  var expand, regex = false, sep = '';

  // store a ref to unmodified arg
  var origA = a;
  var origB = b;

  b = (b.toString() === '-0') ? 0 : b;

  // handle special step characters
  if (typeof step === 'string') {
    var match = stepRe().exec(step);
    if (match) {
      var i = match.index;

      // repeat string
      if (match[0] === '+') {
        return repeat(a, b);

      // randomize a, `b` times
      } else if (match[0] === '?') {
        return [randomize(a, b)];

      // expand right, no regex reduction
      } else if (match[0] === '>') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;

      // expand to an array, or if valid create a reduced
      // string for a regex logic `or`
      } else if (match[0] === '|') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;
        regex = true;
        sep = match[0];

      // expand to an array, or if valid create a reduced
      // string for a regex range
      } else if (match[0] === '~') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;
        regex = true;
        sep = match[0];
      }
    } else if (!isNumber(step)) {
      throw new TypeError('fill-range: invalid step.');
    }
  }

  // has neither a letter nor number, or has both letters and numbers
  if (!noAlphaNum(a) || !noAlphaNum(b) || hasBoth(a) || hasBoth(b)) {
    throw new Error('fill-range: invalid range arguments.');
  }

  // validate arguments
  var isNumA = isNumber(zeros(a));
  var isNumB = isNumber(zeros(b));

  if ((!isNumA && isNumB) || (isNumA && !isNumB)) {
    throw new TypeError('fill-range: first range argument is incompatible with second.');
  }

  // by this point both are the same, so we
  // can use A to check going forward.
  var isNum = isNumA;
  var num = step && isNumber(step)
    ? Math.abs(+step)
    : 1;

  // is the range alphabetical? or numeric?
  if (isNum) {
    // if numeric coerce to an integer
    a = +a;
    b = +b;
  } else {
    // otherwise, get the charCode to expand alpha ranges
    a = a.charCodeAt(0);
    b = b.charCodeAt(0);
  }

  // is the pattern positive or negative?
  var isNegative = a >= b;

  // detect padding
  var padding = isPadded(origA, origB);
  var res, pad, arr = [];
  var ii = 0;

  // character classes, ranges and logical `or`
  if (regex && !padding && num === 1 && a < b) {
    return wrap([origA, origB], '-');
  }

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

  if (sep === '~') { sep = '-'; }
  if (regex) {
    if (a < 0 || b < 0) { return arr; }
    var len = arr.length;
    if (isNegative) {
      return wrap(arr, '|');
    }
    if (num === 1 && len === 2) {
      return wrap(arr, '|');
    }
    if (num > 1 /* step */) {
      return wrap(arr, '|');
    }
  }

  return expand ? wrap(arr, sep) : arr;
}

/**
 * Step regex
 */

function wrap(str, sep) {
  str = str.join(sep);
  if (sep === '|') {
    str = '(' + str + ')';
  }
  if (sep === '-') {
    str = '[' + str + ']';
  }
  return [str];
}

/**
 * Step regex
 */

function stepRe() {
  return /\?|>|\||\+|\~/g;
}

/**
 * Return true if `val` has either a letter
 * or a number
 */

function noAlphaNum(val) {
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
  if (/^-*0+$/.test(val.toString())) {
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
 * Get the string length of `val`
 */

function length(val) {
  return val.toString().length;
}
