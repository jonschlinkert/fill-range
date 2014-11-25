/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var repeat = require('repeat-string');

var range = module.exports = function(a, b, c) {
  var isLetter = !parseInt(a, 10) && +a !== 0;
  var arr = [];
  console.log(isLetter)
  a = isLetter ? a.charCodeAt(0) : +a;
  b = isLetter ? b.charCodeAt(0) : +b;

  a = a < b ? (a -= (c || 1)) : (a += (c || 1));

  for (var i = 0; a < b ? (a < b) : (a > b); a < b ? i++ : i--) {
    var val = a < b ? (a += (c || 1)) : (a -= (c || 1));
    arr.push(String(isLetter ? String.fromCharCode(val) : pad(val, b)));
  }

  return arr;
};

// function pad(a, b) {
//   a = String(a);
//   b = String(b);

//   a = a[0] === '-' ? a.slice(1) : a;
//   b = b[0] === '-' ? b.slice(1) : b;

//   var diff = b.length - a.length;
//   // console.log(diff)
//   return repeat('0', diff) + a;
// }


console.log(range('a', 'j'))
console.log(range('j', 'a'))
console.log(range(-2, -10, 2))
console.log(range(-10, -2, 2))
console.log(range(-10, -1))
console.log(range(2, 10, 2))
console.log(range(1, 9))
console.log(range(9, -4))
console.log(range(-9, 9, 3))
console.log(range(0, -5))