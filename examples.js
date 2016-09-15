var fill = require('./');

console.log(fill(0, 25, 5));
//=> [ 0, 5, 10, 15, 20, 25 ]

console.log(fill('a', 'e', {toRegex: true}));
//=> '[a-e]'

console.log(fill('a', 'z', 3, {toRegex: true}));
//=> 'a|d|g|j|m|p|s|v|y'

console.log(fill('1', '100', {toRegex: true}));
//=> '[1-9]|[1-9][0-9]|100'
