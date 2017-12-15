const fs = require('fs');

/**
 * Attempt to load package.json within the current directory.
 * @returns {string} The string representation of package.json
 */
exports.loadPackageJson = () => {
  try {
    return fs.readFileSync('package.json');
  } catch (e) {
    console.warn('Unable to load config from package.json');
    // Return the string representation of an empty JSON object,
    // as it will be parsed outside of this method
    return '{}';
  }
};

/**
 * Escape special characters with the respective TeamCity escaping.
 * See below link for list of special characters:
 * https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
 * @param {string} str The raw message to display in TeamCity build log.
 * @returns {string} An error message formatted for display in TeamCity
 */
exports.escapeTeamCityString = str => {
  if (!str) {
    return '';
  }

  return str
    .replace(/\|/g, '||')
    .replace(/'/g, "|'")
    .replace(/\n/g, '|n')
    .replace(/\r/g, '|r')
    .replace(/\u0085/g, '|x') // TeamCity 6
    .replace(/\u2028/g, '|l') // TeamCity 6
    .replace(/\u2029/g, '|p') // TeamCity 6
    .replace(/\[/g, '|[')
    .replace(/\]/g, '|]');
};
