var fs = require('fs');

function loadConfig() {
  return fs.readFileSync('package.json');
}

module.exports.loadConfig = loadConfig;
