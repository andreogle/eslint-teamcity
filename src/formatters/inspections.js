module.exports = (results) => {
  const inspectionsList = [];
  let inspectionCount = 0;

  results.forEach(result => {
    const filePath = escapeTeamCityString(result.filePath);

    result.messages.forEach(message => {
      const isError = message.fatal || message.severity === 2;
      const rule = escapeTeamCityString(message.ruleId);
      const escapedMessage = escapeTeamCityString(message.message);

      inspectionsList.push(
        `##teamcity[inspectionType id='${rule}' category='ESLint violations' ` +
        `name='${rule}' description='ESlint Violations']`
      );

      const detailedMessage = `line ${message.line || 0}, col ${message.column || 0}, ${escapedMessage}`;

      inspectionsList.push(
        `##teamcity[inspection typeId='${rule}' message='${detailedMessage}' ` +
        `file='${filePath}' line='${message.line || 0}' SEVERITY='${isError ? 'ERROR' : 'WARNING'}']`
      );

      inspectionCount++;
    });
  });

  return { inspections: inspectionsList, inspectionCount };
}
