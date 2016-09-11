'use strict';

var path = require('path');
var util = require('util');
var cyan = require('ansi-cyan');
var argv = require('yargs-parser')(process.argv.slice(2));
var Suite = require('benchmarked');

function run(code, fixtures) {
  var suite = new Suite({
    cwd: __dirname,
    fixtures: `fixtures/${fixtures}.js`,
    code: `code/${code}*.js`
  });

  if (argv.dry) {
    suite.dryRun(function(code, fixture) {
      if (/special/.test(fixture.stem)) return;
      console.log(cyan('%s > %s'), code.key, fixture.key);
      var args = require(fixture.path);
      var res = code.run.apply(null, args).length;
      console.log(util.inspect(res, null, 10));
      console.log();
    });
  } else {
    suite.run();
  }
}

run(argv._[0] || '*', argv._[1] || '**/{1,2,a}*');
