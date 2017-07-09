#!/usr/bin/env node

'use strict';
var fs = require('fs-extra'),
  procArg = process.argv;

if (require.main === module) {
  process.stdout.write(main(fs.readJSONSync(procArg[2])))
} else {
  module.exports = main;
}

function main(input) {
  return require('./src/formatter')(input);
}