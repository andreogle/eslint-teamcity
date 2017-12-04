/**
 * @fileoverview TeamCity report formatter plugin for ESLint
 * @author Andre Ogle
 */

'use strict';

const utils = require('./utils');
const errorFormatter = require('./formatters/errors');
const inspectionFormatter = require('./formatters/inspections');

function getUserConfig(propNames) {
  const config = JSON.parse(utils.loadConfig())['eslint-teamcity'] || {};

  const showInspections = propNames.inspections || !!config['inspections'] || false;
  const reportName = propNames.reportName || config['report-name'] || 'ESLint Violations';
  const inspectionCountName = propNames.inspectionCountName || config['inspection-count-name'] || 'ESLint Inspection Count';
  const errorCountName = propNames.errorCountName || config['error-count-name'] || 'ESLint Error Count';
  const warningCountName = propNames.warningCountName || config['warning-count-name'] || 'ESLint Warning Count';

  return {
    showInspections,
    reportName: utils.escapeTeamCityString(reportName),
    inspectionCountName: utils.escapeTeamCityString(inspectionCountName),
    errorCountName: utils.escapeTeamCityString(errorCountName),
    warningCountName: utils.escapeTeamCityString(warningCountName),
  };
}

module.exports = (results, propNames) => {
  const config = getUserConfig(propNames);

  let outputList = [];
  if (config.showInspections) {
    const { inspections, inspectionCount } = inspectionFormatter.getInspections(results);
    outputList = inspections;
    outputList.push(`##teamcity[buildStatisticValue key='${config.inspectionCountName}' value='${inspectionCount}']`);
  } else {
    const { errorsAndWarnings, errorCount, warningCount } = errorFormatter.getErrors(results);
    outputList = errorsAndWarnings;
    outputList.push(`##teamcity[buildStatisticValue key='${config.errorCountName}' value='${errorCount}']`);
    outputList.push(`##teamcity[buildStatisticValue key='${config.warningCountName}' value='${warningCount}']`);
  }

  return outputList.join('\n');
};

