'use strict';

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const suite = require('benchmarked');
const write = require('write');
const code = argv._[0] || '*';
const fixtures = argv._[1] || '*';

suite.run({ code: `code/${code}.js`, fixtures: `fixtures/${fixtures}.js` })
  .then(function(stats) {
    write.sync(path.join(__dirname, 'stats.json'), JSON.stringify(stats, null, 2))
    write.sync(path.join(__dirname, 'stats.md'), suite.render(stats));
  })
  .catch(console.error);
