/* global it, describe, beforeEach, afterEach */

const { expect } = require('chai');
const formatInspections = require('../../src/formatters/inspections');
const {
  createDummyError,
  createDummyWarning,
  createFatalError
} = require('../helpers/eslint-result-generator');

describe('inspection formatting', () => {
  const reportConfig = {
    reportName: 'ESLint Violations',
    inspectionCountName: 'ESLintInspectionCount',
    errorCountName: 'ESLintErrorCount',
    warningCountName: 'ESLintWarningCount'
  };
  let results = [];

  afterEach(() => {
    results = [];
  });

  describe('fatal error output', () => {
    beforeEach(() => {
      results.push(createFatalError());
    });

    it('should include the inspection types', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[0]).to.eql(
        "##teamcity[inspectionType id='no-eval' category='ESLint Violations' name='no-eval' description='ESLint Violations']"
      );
    });

    it('should include the inspections', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[1]).to.contain(
        "##teamcity[inspection typeId='no-eval' message='line 1, col 1, Some fatal error' file='testfile-fatal.js' line='1' SEVERITY='ERROR']"
      );
    });
  });

  describe('error output', () => {
    beforeEach(() => {
      results.push(createDummyError());
    });

    it('should include the inspection types', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[0]).to.eql(
        "##teamcity[inspectionType id='no-console' category='ESLint Violations' name='no-console' description='ESLint Violations']"
      );
      expect(outputList[2]).to.eql(
        "##teamcity[inspectionType id='no-unreachable' category='ESLint Violations' name='no-unreachable' description='ESLint Violations']"
      );
    });

    it('should include the inspections', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[1]).to.eql(
        "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
      );
      expect(outputList[3]).to.eql(
        "##teamcity[inspection typeId='no-unreachable' message='line 2, col 1, This is a test error.' file='testfile.js' line='2' SEVERITY='ERROR']"
      );
    });
  });

  describe('warning output', () => {
    beforeEach(() => {
      results.push(createDummyWarning());
    });

    it('should include the inspection types', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[0]).to.eql(
        "##teamcity[inspectionType id='eqeqeq' category='ESLint Violations' name='eqeqeq' description='ESLint Violations']"
      );
      expect(outputList[2]).to.eql(
        "##teamcity[inspectionType id='complexity' category='ESLint Violations' name='complexity' description='ESLint Violations']"
      );
    });

    it('should include the inspections', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[1]).to.eql(
        "##teamcity[inspection typeId='eqeqeq' message='line 1, col 1, Some warning' file='testfile-warning.js' line='1' SEVERITY='WARNING']"
      );
      expect(outputList[3]).to.eql(
        "##teamcity[inspection typeId='complexity' message='line 2, col 2, This is a test warning.' file='testfile-warning.js' line='2' SEVERITY='WARNING']"
      );
    });
  });

  describe('build statistics', () => {
    beforeEach(() => {
      results.push(createDummyWarning());
      results.push(createDummyError());
    });

    it('should contain total error count', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[8]).to.eql(
        "##teamcity[buildStatisticValue key='ESLintErrorCount' value='2']"
      );
    });

    it('should contain total warning count', () => {
      const outputList = formatInspections(results, reportConfig);
      expect(outputList[9]).to.eql(
        "##teamcity[buildStatisticValue key='ESLintWarningCount' value='2']"
      );
    });
  });
});
