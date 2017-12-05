const utils = require('../utils');

module.exports = (results, config) => {
  const { reportName } = config;
  const outputList = [];
  let errorCount = 0;
  let warningCount = 0;

  results.forEach(result => {
    const messages = result.messages;

    if (messages.length === 0) {
      return;
    }

    const filePath = utils.escapeTeamCityString(result.filePath);

    messages.forEach(messageObj => {
      const { line, column, message, ruleId, fatal, severity } = messageObj;
      const rule = escapeTeamCityString(ruleId);
      const isError = message.fatal || message.severity === 2;

      const escapedMessage = escapeTeamCityString(message);
      const formattedMessage = `line ${message.line || 0}, col ${message.column || 0}, ${escapedMessage}`;

      outputList.push(
        `##teamcity[inspectionType id='${rule}' category='${reportName}' name='${rule}' description='${reportName}']`
      );

      outputList.push(
        `##teamcity[inspection typeId='${rule}' message='${formattedMessage}' ` +
        `file='${filePath}' line='${message.line || 0}' SEVERITY='${isError ? 'ERROR' : 'WARNING'}']`
      );

      if (!isError) {
        errorCount++;
      } else {
        warningCount++;
      }
    });
  });

  outputList.push(`##teamcity[buildStatisticValue key='${config.errorCountName}' value='${errorCount}']`);
  outputList.push(`##teamcity[buildStatisticValue key='${config.warningCountName}' value='${warningCount}']`);

  return outputList;
}
