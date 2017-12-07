#!/usr/bin/env node

const fs = require('fs-extra');
const formatter = require('./src/formatter');

const procArg = process.argv;

/**
 * main function
 * @param {String} input - input data stringify json
 * @param {Object} [teamcityPropNames] - any config variables
 * @returns {String} format result
 */
function main(input, teamcityPropNames) {
  return formatter(input, teamcityPropNames);
}

if (require.main === module) {
  process.stdout.write(main(fs.readJSONSync(procArg[2])));
} else {
  module.exports = main;
}
