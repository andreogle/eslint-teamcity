const utils = require('../utils');

module.exports = (results, config) => {
  const { reportName } = config;
  const outputList = [];
  let errorCount = 0;
  let warningCount = 0;

  outputList.push(`##teamcity[testSuiteStarted name='${reportName}']`);

  results.forEach(result => {
    const messages = result.messages;

    if (messages.length === 0) {
      return;
    }

    const filePath = utils.escapeTeamCityString(result.filePath);

    outputList.push(
      `##teamcity[testStarted name='${reportName}: ${filePath}']`
    );

    const errorsList = [];
    const warningsList = [];

    messages.forEach(messageObj => {
      const { line, column, message, ruleId, fatal, severity } = messageObj;
      const rule = utils.escapeTeamCityString(ruleId);
      const isError = fatal || severity === 2;

      const formattedMessage = `line ${line}, col ${column}, ${message}${rule ? ` (${rule})` : ''}`;

      if (!isError) {
        warningsList.push(formattedMessage);
        warningCount++;
      } else {
        errorsList.push(formattedMessage);
        errorCount++;
      }
    });

    // Display all errors and warnings together (after we've looped through all messages for a given file)
    if (errorsList.length) {
      const errors = utils.escapeTeamCityString(errorsList.join('\n'));
      outputList.push(
        `##teamcity[testFailed name='${reportName}: ${filePath}' message='${errors}']`
      );
    }

    if (warningsList.length) {
      const warnings = utils.escapeTeamCityString(warningsList.join('\n'));
      outputList.push(
        `##teamcity[testStdOut name='${reportName}: ${filePath}' out='warning: ${warnings}']`
      );
    }

    outputList.push(
      `##teamcity[testFinished name='${reportName}: ${filePath}']`
    );
  });

  outputList.push(`##teamcity[testSuiteFinished name='${reportName}']`);

  outputList.push(`##teamcity[buildStatisticValue key='${config.errorCountName}' value='${errorCount}']`);
  outputList.push(`##teamcity[buildStatisticValue key='${config.warningCountName}' value='${warningCount}']`);

  return outputList;
}
