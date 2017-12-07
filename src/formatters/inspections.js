const utils = require('../utils');

module.exports = (results, config) => {
  const { reportName } = config;
  const outputList = [];
  let errorCount = 0;
  let warningCount = 0;

  results.forEach(result => {
    const { messages } = result;

    if (messages.length === 0) {
      return;
    }

    const filePath = utils.escapeTeamCityString(result.filePath);

    messages.forEach(messageObj => {
      const { line, column, message, ruleId, fatal, severity } = messageObj;
      const rule = utils.escapeTeamCityString(ruleId);
      const isError = fatal || severity === 2;

      const escapedMessage = utils.escapeTeamCityString(message);
      const formattedMessage = `line ${line || 0}, col ${column || 0}, ${escapedMessage}`;

      outputList.push(
        `##teamcity[inspectionType id='${rule}' category='${reportName}' name='${rule}' description='${reportName}']`
      );

      const severityLevel = isError ? 'ERROR' : 'WARNING';
      outputList.push(
        `##teamcity[inspection typeId='${rule}' message='${formattedMessage}' ` +
          `file='${filePath}' line='${message.line || 0}' SEVERITY='${severityLevel}']`
      );

      if (!isError) {
        errorCount += 1;
      } else {
        warningCount += 1;
      }
    });
  });

  outputList.push(
    `##teamcity[buildStatisticValue key='${config.errorCountName}' value='${errorCount}']`
  );
  outputList.push(
    `##teamcity[buildStatisticValue key='${config.warningCountName}' value='${warningCount}']`
  );

  return outputList;
};
