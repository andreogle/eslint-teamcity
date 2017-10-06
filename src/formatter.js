/**
 * @fileoverview TeamCity report formatter plugin for ESLint
 * @author Andre Ogle
 */

'use strict';

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Escape special characters with the respective TeamCity escaping.
 * See below link for list of special characters:
 * https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
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

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
module.exports = function(results, teamcityPropNames) {
  const varNames = teamcityPropNames || {};
  const reportName = varNames.reportName || 'ESLint Violations';
  const inspectionCountName = varNames.errorCountName || 'ESLintInspectionCount';

  const inspectionsList = [];
  let inspectionCount = 0;

  results.forEach(result => {
    const messages = result.messages;

    if (messages.length === 0) {
      return;
    }

    const filePath = escapeTeamCityString(result.filePath);

    messages.forEach(message => {
      const isError = message.fatal || message.severity === 2;
      const inspectionId = `inspection-${inspectionCount + 1}`;

      inspectionsList.push(
        `##teamcity[inspectionType id='${inspectionId}' category='ESLint Violations' ` +
        `name='${inspectionId}' description='ESlint Violations']`
      );

      const errorMessage = `line ${message.line || 0}, col ${message.column || 0}, ` +
        `${message.message} ${message.ruleId ? ` (${message.ruleId})` : ''}`;

      inspectionsList.push(
        `##teamcity[inspection typeId='${inspectionId} message='${errorMessage}' ` +
        `file='${filePath}' line='${message.line || 0}' SEVERITY='${isError ? 'ERROR' : 'WARNING'}`
      );

      inspectionCount++;
    });
  });

  inspectionsList.push(`##teamcity[buildStatisticValue key='${inspectionCountName}' value='${inspectionCount}']`);

  return inspectionsList.join('\n');
};

