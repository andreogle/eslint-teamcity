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
 * @param {String} input - input data stringify json
 * @param {Object} [teamcityPropNames] - names of the vars
 * @returns {String} format result
 */
function main(input, teamcityPropNames) {
  return require('./src/formatter')(input, teamcityPropNames);
}