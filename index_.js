/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('util');
var isObject = require('isobject');
var isNumber = require('is-number');
var isNegativeZero = require('is-negative-zero');
var randomize = require('randomatic');
var repeat = require('repeat-element');
var extend = require('extend-shallow');
var repeat = require('repeat-string');

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `a` Start of the range
 * @param  {String} `b` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function fillRange(min, max, step, options, fn) {
  var opts = createOptions(min, max, step, options, fn);
  if (opts.step === 'invalid') {
    if (opts.strict === true) {
      throw new TypeError('expected options.step to be a number');
    }
    return [];
  }

  if (opts.isNumber) {
    return fillNumeric(min, max, opts);
  }

  return fillAlpha(min, max, opts);
}

function fillAlpha(min, max, options) {
  if (isNumber(max) || typeof max !== 'string') {
    return [];
  }


  var a = String(min).charCodeAt(0);
  var b = String(max).charCodeAt(0);

  if (a === b) {
    return [min];
  }

  var fn = transform(options, function(code) {
    return isNumber(code) ? String.fromCharCode(code) : code;
  });

  if (a > b) {
    return decrement(a, b, options, fn);
  }
  return increment(a, b, options, fn);
}

function fillNumeric(min, max, options) {
  if (!isValidNumber(min) || !isValidNumber(max)) {
    if (options && options.strict === true) {
      throw new RangeError('invalid range arguments :' + util.inspect(arguments));
    }
    return [];
  }

  var pad = '';
  var a = min >> 0;
  var b = max >> 0;

  if (a === b) {
    return [options.stringify ? String(a) : a];
  }

  var fn = transform(options, function(n) {
    return options.stringify ? zeros(n, options) : n;
  });

  if (a > b) {
    return decrement(a, b, options, fn);
  }
  return increment(a, b, options, fn);
}

function increment(min, max, options, fn) {
  var arr = [];
  var idx = 0;
  for (var i = min; i < max + 1; i += options.step) {
    push(arr, i, ++idx, max, min, options, fn);
  }
  return arr;
}

function decrement(max, min, options, fn) {
  var arr = [];
  var idx = 0;
  for (var i = max; i > min -1; i -= options.step) {
    push(arr, i, ++idx, max, min, options, fn);
  }
  return arr;
}

function push(arr, n, idx, a, b, options, fn) {
  var val = n;
  if (typeof fn === 'function') {
    val = fn(n, a, b, idx, arr, options);
  }
  if (options.stringify === true) {
    val = String(val);
  }
  arr.push(val);
}

function createOptions(min, max, step, options, fn) {
  var args = arguments;
  var opts = {};

  for (var i = 2; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg === 'undefined') {
      continue;
    }

    if (typeof arg === 'string' || isNumber(arg)) {
      opts.step = arg;
    } else if (typeof arg === 'function') {
      opts.transform = arg;
    } else if (isObject(arg)) {
      opts = extend({}, opts, arg);
    }
  }

  opts.isNumber = isNumber(min);
  opts.isPadded = isPadded(min) || isPadded(max);
  opts.maxLength = 0;

  if (opts.step && !isValidNumber(opts.step)) {
    opts.step = 'invalid';
    return opts;
  }

  if (typeof fn === 'function') {
    opts.transform = fn;
  }

  if (opts.isPadded) {
    opts.maxLength = Math.max(String(min).length, String(max).length);
  }

  opts.stringify = opts.stringify
    || typeof opts.step === 'string'
    || typeof min === 'string'
    || typeof max === 'string'
    || opts.isPadded;

  opts.step = Math.abs(opts.step >> 0) || 1;
  if (typeof min === 'string') {
    opts.type = 'string';
  }
  return opts;
}

function transform(options, mod) {
  if (typeof options.transform === 'function') {
    return function() {
      return mod(options.transform.apply(null, arguments));
    }
  }
  return mod;
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

function isValidNumber(n) {
  return isNumber(n) && /^[\d-]+$/.test(String(n));
}

function isValidLetter(ch) {
  return typeof ch === 'string' && ch.length === 1
    && /[-\[\]+\\\^_`({})*+,-./:;<=>?@a-z0-9]/i.test(ch);
}

function isPadded(str) {
  return /^-*0\d+/.test(str);
}

function identity(val) {
  return val;
}

/**
 * Expose `fillRange`
 */

module.exports = fillRange;
