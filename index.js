/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var isNumber = require('is-number');

module.exports = function fillRange(a, b, c, fn) {
  if (typeof c === 'function') {
    fn = c;
    c = undefined;
  }

  var bad = /\./.test(a)
    || /\./.test(b)
    || c && !isNumber(c)
    || (!isNumber(Math.abs(a)) && isNumber(Math.abs(b))
      || isNumber(Math.abs(a)) && !isNumber(Math.abs(b)));

  if (bad) {
    return {bad: [ '{' + [a, b, c].filter(Boolean).join('..') + '}']};
  }

  var inc = typeof c !== 'undefined'
      ? (+c < 0) ? (+c * -1) : +c
      : 1;

  var isLetter = !isNumber(+a);
  a = isLetter ? a.charCodeAt(0) : +a;
  b = isLetter ? b.charCodeAt(0) : +b;

  if (b < a) {
    return negativeRange(a, b, inc, fn, isLetter);
  }

  return positiveRange(a, b, inc, fn, isLetter);
};

function positiveRange(a, b, inc, fn, isLetter) {
  var arr = [];
  a -= inc;

  for (var i = 0; a < b; i++) {
    a += inc;
    if (a <= b) {
      var res = fn && fn(a, isLetter, i);
      arr.push(res ? res : isLetter
        ? String.fromCharCode(a)
        : String(a));
    }
  }
  return arr;
}

function negativeRange(a, b, inc, fn, isLetter) {
  var arr = [];
  a += inc;

  for (var i = 0; a > b; i--) {
    a -= inc;
    if (a >= b) {
      var res = fn && fn(a, isLetter, i);
      arr.push(res ? res : isLetter
        ? String.fromCharCode(a)
        : String(a));
    }
  }
  return arr;
}
