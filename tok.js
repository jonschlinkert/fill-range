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
var randomize = require('randomatic');
var repeatStr = require('repeat-string');
var repeat = require('repeat-element');
var extend = require('extend-shallow');

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `a` Start of the range
 * @param  {String} `b` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function fillRange(min, max, options, fn) {
  var opts = createOptions(options, fn);
  var a = new Tok(min);
  var b = new Tok(max);

  console.log(a.pad)
  console.log(b.pad)

  if (typeof min === 'string') {
    opts.type = 'string';
  }
  if (isNumber(min)) {
    return fillNumeric(min, max, opts);
  }

  return fillAlpha(min, max, opts);
}

/**
 * Expose `fillRange`
 */

module.exports = fillRange;

function fillAlpha(min, max, options) {
  if (isNumber(max) || typeof max !== 'string') {
    throw new RangeError('invalid range arguments: ' + util.inspect([].slice.call(arguments)));
  }

  var a = String(min).charCodeAt(0);
  var b = String(max).charCodeAt(0);

  var fn = transform(options, function(code) {
    return String.fromCharCode(code);
  });

  if (a > b) {
    return decrement(a, b, options.step, fn);
  }
  return increment(a, b, options.step, fn);
}

function fillNumeric(min, max, options) {
  if (!isNumber(max)) {
    throw new RangeError('invalid range arguments: ' + util.inspect([].slice.call(arguments)));
  }

  var type = typeof min;
  var a = +min;
  var b = +max;

  var fn = transform(options, function(n) {
    return type === 'string' ? String(n) : n;
  });

  if (a > b) {
    return decrement(a, b, options.step, fn);
  }
  return increment(a, b, options.step, fn);
}

function increment(min, max, step, fn) {
  var arr = [];
  for (var i = min; i < max + 1; i += step) {
    push(arr, i, max, min, step, fn);
  }
  return arr;
}

function decrement(max, min, step, fn) {
  var arr = [];
  for (var i = max; i > min -1; i -= step) {
    push(arr, i, max, min, step, fn);
  }
  return arr;
}

function push(arr, n, a, b, step, fn) {
  if (typeof fn === 'function') {
    arr.push(fn(n, a, b, step, arr));
  } else {
    arr.push(n);
  }
}

function createOptions(options, fn) {
  var opts = {};
  if (typeof options === 'string' || isNumber(options)) {
    opts = { step: options };
  } else if (typeof options === 'function') {
    opts = { transform: options };
  } else {
    opts = extend({}, options);
  }

  if (typeof fn === 'function') {
    opts.transform = fn;
  }

  if (!isNumber(opts.step)) {
    opts.step = 1;
  }

  opts.step = Math.abs(opts.step);
  return opts;
}

function transform(options, mod) {
  if (typeof options.transform === 'function') {
    var fn = options.transform;
    return function() {
      return mod(fn.apply(null, arguments));
    }
  }
  return mod;
}

function identity(val) {
  return val;
}

function Tok(val, options, fn) {
  this.orig = val;

  define(this, 'length', function() {
    return this.string.length;
  });

  define(this, 'string', function() {
    return String(val);
  });

  define(this, 'pad', function() {
    var m = /^-?(0+)/.exec(this.string);
    return m ? m[0] : '';
  });

  this.isNumber = isNumber(val);
  this.type = typeof val;

  if (this.isNumber) {
    this.num = +val;
  } else if (typeof val !== 'string') {
    throw new TypeError('expected a string or number: ' + val);
  } else {
    this.num = val.charCodeAt(0);
  }
}

function define(tok, prop, fn) {
  var cached;
  Object.defineProperty(tok, prop, {
    configurable: true,
    enumerable: true,
    set: function() {
      cached = val;
    },
    get: function() {
      if (typeof cached !== 'undefined') {
        return cached;
      }
      return (cached = fn.call(tok));
    }
  });
}
