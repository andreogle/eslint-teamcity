/* global it, describe, beforeEach, afterEach */

const { expect } = require('chai');
const formatErrors = require('../../src/formatters/errors');
const {
  createDummyError,
  createDummyWarning,
  createFatalError
} = require('../helpers/eslint-factory');

describe('error formatting', function() {
  const reportConfig = {
    reportName: 'ESLint Violations',
    errorStatisticsName: 'ESLintErrorCount',
    warningStatisticsName: 'ESLintWarningCount'
  };

  let results = [];

  afterEach(function() {
    results = [];
  });

  describe('test suite name', function() {
    it('should include the test suite name header', function() {
      expect(formatErrors(results, reportConfig)[0]).to.eql(
        "##teamcity[testSuiteStarted name='ESLint Violations']"
      );
    });

    it('should include the test suite name footer', function() {
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testSuiteFinished name='ESLint Violations']"
      );
    });
  });

  describe('fatal error output', function() {
    beforeEach(function() {
      results.push(createFatalError());
    });

    it('should include filename at the start of each file test', function() {
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile-fatal.js']"
      );
    });

    it('should include all errors within their respective file', function() {
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testFailed name='ESLint Violations: testfile-fatal.js' message='line 1, col 1, Some fatal error (no-eval)']"
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(formatErrors(results, reportConfig)[3]).to.eql(
        "##teamcity[testFinished name='ESLint Violations: testfile-fatal.js']"
      );
    });
  });

  describe('error output', function() {
    beforeEach(function() {
      results.push(createDummyError());
    });

    it('should include filename at the start of each file test', function() {
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile.js']"
      );
    });

    it('should include all errors within their respective file', function() {
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testFailed name='ESLint Violations: testfile.js' message='line 1, col 1, |'|n|r|x|l|p|||[|] (no-console)|nline 2, col 1, This is a test error. (no-unreachable)']"
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(formatErrors(results, reportConfig)[3]).to.eql(
        "##teamcity[testFinished name='ESLint Violations: testfile.js']"
      );
    });
  });

  describe('warning output', function() {
    beforeEach(function() {
      results.push(createDummyWarning());
    });

    it('should include filename at the start of each file test', function() {
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile-warning.js']"
      );
    });

    it('should include all warnings within their respective file', function() {
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testStdOut name='ESLint Violations: testfile-warning.js' out='warning: line 1, col 1, Some warning (eqeqeq)|nline 2, col 2, This is a test warning. (complexity)']"
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(formatErrors(results, reportConfig)[3]).to.eql(
        "##teamcity[testFinished name='ESLint Violations: testfile-warning.js']"
      );
    });
  });

  describe('build statistics', function() {
    beforeEach(function() {
      results.push(createDummyWarning());
      results.push(createDummyError());
    });

    it('should contain total error count', function() {
      expect(formatErrors(results, reportConfig)[8]).to.eql(
        "##teamcity[buildStatisticValue key='ESLintErrorCount' value='2']"
      );
    });

    it('should contain total warning count', function() {
      expect(formatErrors(results, reportConfig)[9]).to.eql(
        "##teamcity[buildStatisticValue key='ESLintWarningCount' value='2']"
      );
    });
  });
});
