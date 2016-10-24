/**
 * @fileoverview TeamCity report formatter plugin for ESLint
 * @author Andre Ogle
 */

'use strict';

var utils = require('./utils');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Escape special characters with the respective TeamCity escaping.
 * See below link for list of special characters:
 * https://confluence.jetbrains.com/display/TCD9/Build+Script+Interaction+with+TeamCity
 * @param {string} str An error message to display in TeamCity.
 * @returns {string} An error message formatted for display in TeamCity
 */
function escapeTeamCityString(str) {
  if (!str) {
    return '';
  }

  return str.replace(/\|/g, '||')
    .replace(/\'/g, '|\'')
    .replace(/\n/g, '|n')
    .replace(/\r/g, '|r')
    .replace(/\u0085/g, '|x') // TeamCity 6
    .replace(/\u2028/g, '|l') // TeamCity 6
    .replace(/\u2029/g, '|p') // TeamCity 6
    .replace(/\[/g, '|[')
    .replace(/\]/g, '|]');
}

var reportName = 'ESLint Violations';

var options = {
  details: {
    default: true
  },
  summary: {
    default: false
  }
};

function getOptionValue(config, optionName) {
  if (optionName in config) {
    return config[optionName];
  }
  return options[optionName].default;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
module.exports = function(results) {

  var config = JSON.parse(utils.loadConfig())['eslint-teamcity'] || {};

  var optionDetails = getOptionValue(config, 'details');
  var optionSummary = getOptionValue(config, 'summary');

  var output = '';
  var errorCount = 0;
  var warningCount = 0;

  if (optionDetails) {
    output += '##teamcity[testSuiteStarted name=\'' + reportName + '\']\n';
  }

  results.forEach(function(result) {
    var messages = result.messages;

    if (messages.length === 0) {
      return;
    }

    if (optionDetails) {
      output += '##teamcity[testStarted name=\'' + reportName + ': ' +
        escapeTeamCityString(result.filePath) + '\']\n';
    }

    var errorsList = [];
    var warningsList = [];

    messages.forEach(function(message) {
      var userMessage = 'line ' + (message.line || 0) +
          ', col ' + (message.column || 0) + ', ' + message.message + (message.ruleId ? ' (' + message.ruleId + ')' : '');

      if (message.fatal || message.severity === 2) {
        errorsList.push(userMessage);
        errorCount++;
      } else {
        warningsList.push(userMessage);
        warningCount++;
      }
    });

    if (optionDetails) {
      if (errorsList.length) {
        output += '##teamcity[testFailed name=\'' + reportName + ': ' +
          escapeTeamCityString(result.filePath) + '\' message=\'' +
          escapeTeamCityString(errorsList.join('\n')) + '\']\n';
      } else if (warningsList.length) {
        output += '##teamcity[testStdOut name=\'' + reportName + ': ' +
          escapeTeamCityString(result.filePath) + '\' out=\'warning: ' +
          escapeTeamCityString(warningsList.join('\n')) + '\']\n';
      }
      output += '##teamcity[testFinished name=\'' + reportName + ': ' +
        escapeTeamCityString(result.filePath) + '\']\n';
    }
  });

  if (optionDetails) {
    output += '##teamcity[testSuiteFinished name=\'' + reportName + '\']\n';
  }

  if (optionSummary) {
    if (errorCount !== 0) {
      output += '##teamcity[buildStatisticValue key=\'ESLintErrorCount\' value=\'' + errorCount +'\' ]\n';
    }
    if (warningCount !== 0) {
      output += '##teamcity[buildStatisticValue key=\'ESLintWarningCount\' value=\'' + warningCount +'\' ]\n';
    }
  }

  return output;
};
