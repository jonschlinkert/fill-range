'use strict';

const { Suite } = require('benchmark');
const colors = require('ansi-colors');
const argv = require('minimist')(process.argv.slice(2));
const fill60 = require('fill-range');
const fill70 = require('..');

/**
 * Setup
 */

const cycle = (e, newline) => {
  process.stdout.write(`\u001b[G  ${e.target}${newline ? `\n` : ''}`);
};

const bench = (name, options) => {
  const config = { name, ...options };
  const suite = new Suite(config);
  const add = suite.add.bind(suite);
  suite.on('error', console.error);

  if (argv.run && !new RegExp(argv.run).test(name)) {
    suite.add = () => suite;
    return suite;
  }

  console.log(colors.green(`● ${config.name}`));

  suite.add = (key, fn, opts) => {
    if (typeof fn !== 'function') opts = fn;

    add(key, {
      onCycle: e => cycle(e),
      onComplete: e => cycle(e, true),
      fn,
      ...opts
    });
    return suite;
  };

  return suite;
};

const skip = () => {};
skip.add = () => skip;
skip.run = () => skip;
bench.skip = name => {
  console.log(colors.cyan('● ' + colors.unstyle(name) + ' (skipped)'));
  return skip;
};

bench('alpha')
  .add('fill 6.0', () => fill60('a', 'z'))
  .add('fill 7.0', () => fill70('a', 'z'))
  .run();

bench('alpha with step')
  .add('fill 6.0', () => fill60('a', 'z', 5))
  .add('fill 7.0', () => fill70('a', 'z', 5))
  .run();

bench('numbers')
  .add('fill 6.0', () => fill60(1, 50))
  .add('fill 7.0', () => fill70(1, 50))
  .run();

bench('numbers with step')
  .add('fill 6.0', () => fill60(1, 50, 5))
  .add('fill 7.0', () => fill70(1, 50, 5))
  .run();

bench('padded')
  .add('fill 6.0', () => fill60('0', '010'))
  .add('fill 7.0', () => fill70('0', '010'))
  .run();

bench('padded with step')
  .add('fill 6.0', () => fill60('0', '010', 2))
  .add('fill 7.0', () => fill70('0', '010', 2))
  .run();

bench('negative, padded with step')
  .add('fill 6.0', () => fill60('-0020', '0020', 2))
  .add('fill 7.0', () => fill70('-0020', '0020', 2))
  .run();
