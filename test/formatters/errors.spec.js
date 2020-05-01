const { expect } = require('chai');
const formatErrors = require('../../src/formatters/errors');
const { error, warning, fatalError, unknownError } = require('../helpers/eslint-factory');

describe('error formatting', function () {
  const reportConfig = {
    reportName: 'ESLint Violations',
    errorStatisticsName: 'ESLintErrorCount',
    warningStatisticsName: 'ESLintWarningCount',
  };

  describe('test suite name', function () {
    it('should include the test suite name header', function () {
      expect(formatErrors([], reportConfig)[0]).to.eql(
        "##teamcity[testSuiteStarted name='ESLint Violations']"
      );
    });

    it('should include the test suite name footer', function () {
      expect(formatErrors([], reportConfig)[1]).to.eql(
        "##teamcity[testSuiteFinished name='ESLint Violations']"
      );
    });
  });

  describe('unknown error output', function () {
    it('omits the ruleId if it is null', function () {
      const results = [unknownError];
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile-unknown.js']"
      );
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testFailed name='ESLint Violations: testfile-unknown.js' message='line 1, col 1, Some unknown error']"
      );
    });
  });

  describe('fatal error output', function () {
    it('should include filename at the start of each file test', function () {
      const results = [fatalError];
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile-fatal.js']"
      );
    });

    it('should include all errors within their respective file', function () {
      const results = [fatalError];
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testFailed name='ESLint Violations: testfile-fatal.js' message='line 1, col 1, Some fatal error (no-eval)']"
      );
    });

    it('should include filename at the end of each file test', function () {
      const results = [fatalError];
      expect(formatErrors(results, reportConfig)[3]).to.eql(
        "##teamcity[testFinished name='ESLint Violations: testfile-fatal.js']"
      );
    });
  });

  describe('error output', function () {
    it('should include filename at the start of each file test', function () {
      const results = [error];
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile.js']"
      );
    });

    it('should include all errors within their respective file', function () {
      const results = [error];
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testFailed name='ESLint Violations: testfile.js' message='line 1, col 1, |'|n|r|x|l|p|||[|] (no-console)|nline 2, col 1, This is a test error. (no-unreachable)']"
      );
    });

    it('should include filename at the end of each file test', function () {
      const results = [error];
      expect(formatErrors(results, reportConfig)[3]).to.eql(
        "##teamcity[testFinished name='ESLint Violations: testfile.js']"
      );
    });
  });

  describe('output with directory paths', function () {
    it('should render slashes in the service messages', function () {
      const results = [{ ...fatalError, filePath: 'path\\with\\backslash\\file.js' }];
      const outputList = formatErrors(results, reportConfig);
      expect(outputList[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: path/with/backslash/file.js']"
      );
      expect(outputList[2]).to.eql(
        "##teamcity[testFailed name='ESLint Violations: path/with/backslash/file.js' message='line 1, col 1, Some fatal error (no-eval)']"
      );
    });
  });

  describe('warning output', function () {
    it('should include filename at the start of each file test', function () {
      const results = [warning];
      expect(formatErrors(results, reportConfig)[1]).to.eql(
        "##teamcity[testStarted name='ESLint Violations: testfile-warning.js']"
      );
    });

    it('should include all warnings within their respective file', function () {
      const results = [warning];
      expect(formatErrors(results, reportConfig)[2]).to.eql(
        "##teamcity[testStdOut name='ESLint Violations: testfile-warning.js' out='warning: line 1, col 1, Some warning (eqeqeq)|nline 2, col 2, This is a test warning. (complexity)']"
      );
    });

    it('should include filename at the end of each file test', function () {
      const results = [warning];
      expect(formatErrors(results, reportConfig)[3]).to.eql(
        "##teamcity[testFinished name='ESLint Violations: testfile-warning.js']"
      );
    });
  });

  describe('build statistics', function () {
    it('should contain total error count', function () {
      const results = [warning, error];
      expect(formatErrors(results, reportConfig)[8]).to.eql(
        "##teamcity[buildStatisticValue key='ESLintErrorCount' value='2']"
      );
    });

    it('should contain total warning count', function () {
      const results = [warning, error];
      expect(formatErrors(results, reportConfig)[9]).to.eql(
        "##teamcity[buildStatisticValue key='ESLintWarningCount' value='2']"
      );
    });
  });
});
