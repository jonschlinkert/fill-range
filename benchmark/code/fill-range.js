'use strict';

var fill = require('../..');

module.exports = function fn(from, to, step) {
  if (Array.isArray(from)) {
    return fn.apply(undefined, from);
  }
  return fill.apply(undefined, arguments);
};
