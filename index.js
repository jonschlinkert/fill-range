/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('util');
var isNumber = require('is-number');
var extend = require('extend-shallow');
var repeat = require('repeat-string');
var cache = {};

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `min` Start of the range
 * @param  {String} `b` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function toRange(min, max, step, options) {
  if (typeof max === 'undefined' || min === max) {
    return [min];
  }

  var opts = extend({}, options);
  if (typeof step === 'string' || isNumber(step)) {
    opts.step = step;
  } else if (step) {
    opts = extend({}, step);
  }

  var stepOrig = opts.step;
  if (stepOrig && !isValidNumber(stepOrig)) {
    if (opts.strict === true) {
      throw new TypeError('expected options.step to be a number');
    }
    return [];
  }

  opts.step = Math.abs(stepOrig >> 0) || 1;
  opts.isNumber = isValidNumber(min) && isValidNumber(max);
  opts.isPadded = isPadded(min) || isPadded(max);
  opts.toString = opts.stringify
    || typeof stepOrig === 'string'
    || typeof min === 'string'
    || typeof max === 'string'
    || !opts.isNumber;

  var strMin = String(min);
  var strMax = String(max);
  if (opts.isPadded) {
    opts.maxLength = Math.max(strMin.length, strMax.length);
  }

  if (!opts.isNumber && !isValid(min, max)) {
    if (opts && opts.strict === true) {
      throw new RangeError('invalid range arguments: ' + util.inspect([min, max]));
    }
    return [];
  }

  var a = opts.isNumber ? +min : strMin.charCodeAt(0);
  var b = opts.isNumber ? +max : strMax.charCodeAt(0);

  return expand(a, b, opts);
  // if (a < b) {
  //   return increment(a, b, opts);
  // }
  // return decrement(a, b, opts);
}

function increment(min, max, options) {
  var arr = [];
  for (var i = min; i < max + 1; i += options.step) {
    push(arr, i, options);
  }
  return arr;
}

function decrement(max, min, options) {
  var arr = [];
  for (var i = max; i > min - 1; i -= options.step) {
    push(arr, i, options);
  }
  return arr;
}

function push(arr, i, options) {
  var val = options.isNumber ? i : String.fromCharCode(i);
  if (options.toString === false) {
    val = Number(val);
  } else {
    val = String(val);
  }
  if (options.isPadded) {
    val = zeros(val, options);
  }
  arr.push(val);
}

function expand(a, b, options) {
  var descending = a > b;
  var arr = [];

  while (descending ? (a >= b) : (a <= b)) {
    var val = options.isNumber ? a : String.fromCharCode(a);
    if (options.toString === false) {
      val = Number(val);
    } else {
      val = String(val);
    }
    if (options.isPadded) {
      val = zeros(val, options);
    }

    arr.push(val);
    if (descending) {
      a -= options.step;
    } else {
      a += options.step;
    }
  }
  return arr;
}

function zeros(val, options) {
  if (options.isPadded) {
    var str = String(val);
    var len = str.length;
    var dash = '';
    if (str.charAt(0) === '-') {
      dash = '-';
      str = str.slice(1);
    }
    var diff = options.maxLength - len;
    var pad = repeat('0', diff);
    val = (dash + pad + str);
  }
  if (options.stringify) {
    return String(val);
  }
  return val;
}

function isValid(min, max) {
  return (isValidNumber(min) || isValidLetter(min))
      && (isValidNumber(max) || isValidLetter(max));
}

function isPadded(str) {
  return /^-*0\d+/.test(str);
}

function isValidLetter(ch) {
  return typeof ch === 'string' && ch.length === 1 && /^\w+$/.test(ch);
}

function isValidNumber(n) {
  return isNumber(n) && !/\./.test(n);
}

/**
 * Expose `toRange`
 */

module.exports = toRange;
