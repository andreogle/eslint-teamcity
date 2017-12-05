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

  const reportType = propNames.inspections || config['reporter'] || 'errors';
  const reportName = propNames.reportName || config['report-name'] || 'ESLint Violations';
  const errorCountName = propNames.errorCountName || config['error-count-name'] || 'ESLint Error Count';
  const warningCountName = propNames.warningCountName || config['warning-count-name'] || 'ESLint Warning Count';

  return {
    reportType,
    reportName: utils.escapeTeamCityString(reportName),
    errorCountName: utils.escapeTeamCityString(errorCountName),
    warningCountName: utils.escapeTeamCityString(warningCountName),
  };
}

function getTeamCityOutput(results, propNames) {
  const config = getUserConfig(propNames || {});

  let outputMessages = [];
  switch (config.reportType.toLowerCase()) {
    case 'inspections': {
      outputMessages = inspectionFormatter.getInspections(results);
      break;
    }
    case 'errors':
    default: {
      outputMessages = errorFormatter.getErrors(results, config);
      break;
    }
  }

  return outputMessages.join('\n');
}

module.exports = getTeamCityOutput;

