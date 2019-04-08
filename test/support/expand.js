'use strict';

module.exports = (start, stop, step = 1) => {
  let arr = new Array((stop - start) / step);
  let num = 0;

  for (var i = start; i <= stop; i += step) {
    arr[num++] = i;
  }
  return arr;
};
