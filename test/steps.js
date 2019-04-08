'use strict';

require('mocha');
const assert = require('assert');
const exact = require('./support/exact');
const fill = require('..');

describe('steps', () => {
  describe('steps: numbers', () => {
    it('should increment ranges using the given step', () => {
      exact(fill('1', '10', '1'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill('1', '10', '2'), ['1', '3', '5', '7', '9']);
      exact(fill('0', '1000', '200'), ['0','200', '400', '600', '800', '1000']);
      exact(fill('1', '10', 2), ['1', '3', '5', '7', '9']);
      exact(fill('1', '20', '2'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
      exact(fill('1', '20', '20'), ['1']);
      exact(fill('10', '1', '2'), ['10', '8', '6', '4', '2']);
      exact(fill('10', '1', '-2'), ['10', '8', '6', '4', '2']);
      exact(fill('10', '1', '2'), ['10', '8', '6', '4', '2']);
      exact(fill(2, 10, '2'), [2, 4, 6, 8, 10]);
      exact(fill(2, 10, 1), [2, 3, 4, 5, 6, 7, 8, 9, 10]);
      exact(fill(2, 10, 2), [2, 4, 6, 8, 10]);
      exact(fill(2, 10, 3), [2, 5, 8]);
      exact(fill(0, 5, 2), [0, 2, 4]);
      exact(fill(5, 0, 2), [5, 3, 1]);
      exact(fill(1, 5, 2), [1, 3, 5]);
      exact(fill(2, '10', 2), ['2', '4', '6', '8', '10']);
      exact(fill(2, 10, '2'), [2, 4, 6, 8, 10]);
      exact(fill(2, '10', 1), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
      exact(fill(2, '10', '2'), ['2', '4', '6', '8', '10']);
      exact(fill('2', 10, '3'), ['2', '5', '8']);
    });

    it('should fill in negative ranges using the given step (strings)', () => {
      exact(fill('0', '-10', '-2'), ['0', '-2', '-4', '-6', '-8', '-10']);
      exact(fill('-0', '-10', '-2'), ['0', '-2', '-4', '-6', '-8', '-10']);
      exact(fill('-1', '-10', '-2'), ['-1', '-3', '-5', '-7', '-9']);
      exact(fill('-1', '-10', '2'), ['-1', '-3', '-5', '-7', '-9']);
      exact(fill('1', '10', '2'), ['1', '3', '5', '7', '9']);
      exact(fill('1', '20', '2'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
      exact(fill('1', '20', '20'), ['1']);
      exact(fill('10', '1', '-2'), ['10', '8', '6', '4', '2']);
      exact(fill('-10', '0', '2'), ['-10', '-8', '-6', '-4', '-2', '0']);
      exact(fill('-10', '-0', '2'), ['-10', '-8', '-6', '-4', '-2', '0']);
      exact(fill('-0', '-10', '0'), ['0', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
      exact(fill('0', '-10', '-0'), ['0', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    });

    it('should fill in negative ranges using the given step (numbers)', () => {
      exact(fill(-10, 0, 2), [-10, -8, -6, -4, -2, 0]);
      exact(fill(-10, -2, 2), [-10, -8, -6, -4, -2]);
      exact(fill(-2, -10, 1), [-2, -3, -4, -5, -6, -7, -8, -9, -10]);
      exact(fill(0, -10, 2), [0, -2, -4, -6, -8, -10]);
      exact(fill(-2, -10, 2), [-2, -4, -6, -8, -10]);
      exact(fill(-2, -10, 3), [-2, -5, -8]);
      exact(fill(-9, 9, 3), [-9, -6, -3, 0, 3, 6, 9]);
    });

    it('should fill in negative ranges when negative zero is passed', () => {
      exact(fill(-10, -0, 2), [-10, -8, -6, -4, -2, 0]);
      exact(fill(-0, -10, 2), [0, -2, -4, -6, -8, -10]);
    });
  });

  describe('steps: letters', () => {
    it('should use increments with alphabetical ranges', () => {
      exact(fill('z', 'a', -2), ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
      exact(fill('a', 'e', 2), ['a','c', 'e']);
      exact(fill('E', 'A', 2), ['E', 'C', 'A']);
    });
  });

  describe('options: step', () => {
    it('should use the step defined on the options:', () => {
      let options = { step: 2 };
      exact(fill('a', 'e', options), ['a','c', 'e']);
      exact(fill('E', 'A', options), ['E', 'C', 'A']);
    });
  });
});
