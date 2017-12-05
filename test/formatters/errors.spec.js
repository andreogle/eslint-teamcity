const expect = require('chai').expect;
const sinon = require('sinon');
const formatErrors = require('../../src/formatters/errors');
const { createDummyError, createDummyWarning, createFatalError } = require('../helpers/eslint-result-generator');

describe('formatting', () => {
  const reportConfig = {
    reportName: 'ESLint Violations',
    errorCountName: 'ESLintErrorCount',
    warningCountName: 'ESLintWarningCount',
  };
  let results = [];

  afterEach(() => {
    results = [];
  });

  describe('test suite name', () => {
    it('should include the test suite name header', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testSuiteStarted name=\'ESLint Violations\']'
      );
    });

    it('should include the test suite name footer', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testSuiteFinished name=\'ESLint Violations\']'
      );
    });
  });

  describe('file error output', () => {
    beforeEach(() => {
      results.push(createDummyError());
    });

    it('should include filename at the start of each file test', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testStarted name=\'ESLint Violations: testfile.js\']'
      );
    });

    it('should include all errors within their respective file', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testFailed name=\'ESLint Violations: testfile.js message=\'line 1, col 1, |\'|n|r|x|l|p|||[|]|nline 2, col 1, This is a test error. (no-unreachable)\']'
      );
    });

    it('should include filename at the end of each file test', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testFinished name=\'ESLint Violations: testfile.js\']'
      );
    });
  });

  describe('file fatal error output', () => {
    beforeEach(() => {
      results.push(createFatalError());
    });

    it('should include filename at the start of each file test', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testStarted name=\'ESLint Violations: testfile-fatal.js\']'
      );
    });

    it('should include filename at the end of each file test', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testFinished name=\'ESLint Violations: testfile-fatal.js\']'
      );
    });

    it('should include all errors within their respective file', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testFailed name=\'ESLint Violations: testfile-fatal.js message=\'line 1, col 1, Some fatal error\']'
      );
    });
  });

  describe('file warning output', () => {
    beforeEach(() => {
      results.push(createDummyWarning());
    });

    it('should include filename at the start of each file test', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testStarted name=\'ESLint Violations: testfile-warning.js\']'
      );
    });

    it('should include filename at the end of each file test', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testFinished name=\'ESLint Violations: testfile-warning.js\']'
      );
    });

    it('should include all warnings within their respective file', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[testStdOut name=\'ESLint Violations: testfile-warning.js\' out=\'warning: line 1, col 1, Some warning|nline 2, col 2, This is a test warning.\']'
      );
    });
  });

  describe('build statistics', () => {
    beforeEach(() => {
      results.push(createDummyWarning());
      results.push(createDummyError());
    });

    it('should contain total warning count', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[buildStatisticValue key=\'ESLintWarningCount\' value=\'2\']'
      );
    });

    it('should contain total error count', () => {
      expect(formatErrors(results, reportConfig)).to.contain(
        '##teamcity[buildStatisticValue key=\'ESLintErrorCount\' value=\'2\']'
      );
    });
  });
});

