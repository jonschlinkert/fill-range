'use strict';

require('mocha');
const assert = require('assert');
const fill = require('..');

describe('error handling', () => {
  it('should throw when range arguments are invalid and `strictRanges` is true', () => {
    assert.throws(() => {
      fill('0a', '0z', { strictRanges: true });
    }, /Invalid range arguments: \[ '0a', '0z' \]/);

    assert.throws(() => {
      fill('', '*', 2, { strictRanges: true });
    }, /Invalid range arguments: \[ '', '\*' \]/);
  });

  it('should throw when args are incompatible', () => {
    assert.throws(() => {
      fill('a8', 10, { strictRanges: true });
    }, /Invalid range arguments: \[ 'a8', 10 \]/);

    assert.throws(() => {
      fill(1, 'zz', { strictRanges: true });
    }, /Invalid range arguments: \[ 1, 'zz' \]/);
  });

  it('should throw when the step is bad.', () => {
    let opts = { strictRanges: true };
    assert.throws(() => fill('1', '10', 'z', opts), /Expected step "z" to be a number/);
    assert.throws(() => fill('a', 'z', 'a', opts), /Expected step "a" to be a number/);
    assert.throws(() => fill('a', 'z', '0a', opts), /Expected step "0a" to be a number/);
  });
});
