#!/usr/bin/env node

'use strict';
var fs = require('fs-extra'),
  procArg = process.argv;

if (require.main === module) {
  process.stdout.write(main(fs.readJSONSync(procArg[2])))
} else {
  module.exports = main;
}

/**
 * main function
 * @param {String} input - input data stringfy json
 * @param {Object} varNames - names of the vars
 * @return {String}
 */
function main(input) {
  return require('./src/formatter')(input);
}