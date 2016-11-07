var fs = require('fs');

function loadConfig() {
  try {
    return fs.readFileSync('package.json');
  } catch (e) {
    console.warn('Unable to load config from package.json');
    // Return the string representation of an empty JSON object,
    // as it will be parsed outside of this method
    return '{}';
  }
}

module.exports.loadConfig = loadConfig;
