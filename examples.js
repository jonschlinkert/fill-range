'use strict';

var util = require('util');
var fill = require('./');
var res = [];

var ranges = [
  [0, 25, 5],
  ['-1', '-10', -2],
  ['-9', '9', 3],
  ['0', '-5'],
  ['1', '10', 2],
  ['1', '3'],
  ['a', 'e'],
  ['a', 'e', 2],
  ['A', 'E'],
  ['A', 'E', 2],
  ['1', '10', 2],
  ['1', '10', 3],
  ['1', '10', 4],
  ['a', 'z', 5],
  ['a', 'z', 7],
  ['a', 'z', 9],
  ['-5', '-1'],
  ['-5', '5'],
  ['a', 'e', {toRegex: true}],
  ['a', 'z', 3, {toRegex: true}],
  ['1', '100', {toRegex: true}],
  ['1', '1000000', {toRegex: true}],
  ['001', '100', {toRegex: true}],
  ['000001', '100000', {toRegex: true}],
].forEach(function(args) {
  res.push(example(args))
});

function example(args) {
  var str = util.inspect(args).slice(2, -2);
  return `console.log(fill(${str})); //=> `
    + util.inspect(fill.apply(null, args))
}
console.log(res.join('\n'))
