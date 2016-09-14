/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var fill = require('..');

describe('invalid ranges', function() {
  it('should return an empty array when options.strict is not true', function() {
    assert.deepEqual(fill('1.1', '2.1'), []);
    assert.deepEqual(fill('1.2', '2'), []);
    assert.deepEqual(fill('1.20', '2'), []);
    assert.deepEqual(fill('1', '0f'), []);
    assert.deepEqual(fill('1', '10', 'ff'), []);
    assert.deepEqual(fill('1', '10.f'), []);
    assert.deepEqual(fill('1', '10f'), []);
    assert.deepEqual(fill('1', '20', '2f'), []);
    assert.deepEqual(fill('1', '20', 'f2'), []);
    assert.deepEqual(fill('1', '2f', '2'), []);
    assert.deepEqual(fill('1', 'ff', '2'), []);
    assert.deepEqual(fill('1', 'ff'), []);
  });
});
