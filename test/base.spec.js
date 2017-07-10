var expect = require('chai').expect;
var sinon = require('sinon');
var format = require('../src/formatter');
var eslintResultGenerator = require('./eslintResultGenerator');

describe('formatting', function() {
  var results = [];

  afterEach(function() {
    results = [];
  });

  describe('test suite name', function() {
    it('should include the test suite name header', function() {
      expect(format(results)).to.contain(
        '##teamcity[testSuiteStarted name=\'ESLint Violations\']'
      );
    });

    it('should include the test suite name footer', function() {
      expect(format(results)).to.contain(
        '##teamcity[testSuiteFinished name=\'ESLint Violations\']'
      );
    });
  });

  describe('file error output', function() {
    beforeEach(function() {
      results.push(eslintResultGenerator.createDummyError());
    });

    it('should include filename at the start of each file test', function() {
      expect(format(results)).to.contain(
        '##teamcity[testStarted name=\'ESLint Violations: testfile.js\']'
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        '##teamcity[testFinished name=\'ESLint Violations: testfile.js\']'
      );
    });

    it('should include all errors within their respective file', function() {
      expect(format(results)).to.contain(
        'message=\'line 1, col 1, |\'|n|r|x|l|p|||[|]|nline 2, col 1, This is a test error. (no-unreachable)\''
      );
    });
  });

  describe('file fatal error output', function() {
    beforeEach(function() {
      results.push(eslintResultGenerator.createFatalError());
    });

    it('should include filename at the start of each file test', function() {
      expect(format(results)).to.contain(
        '##teamcity[testStarted name=\'ESLint Violations: testfile-fatal.js\']'
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        '##teamcity[testFinished name=\'ESLint Violations: testfile-fatal.js\']'
      );
    });

    it('should include all errors within their respective file', function() {
      expect(format(results)).to.contain(
        'message=\'line 1, col 1, Some fatal error\''
      );
    });
  });

  describe('file warning output', function() {
    beforeEach(function() {
      results.push(eslintResultGenerator.createDummyWarning());
    });

    it('should include filename at the start of each file test', function() {
      expect(format(results)).to.contain(
        '##teamcity[testStarted name=\'ESLint Violations: testfile-warning.js\']'
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        '##teamcity[testFinished name=\'ESLint Violations: testfile-warning.js\']'
      );
    });

    it('should include all warnings within their respective file', function() {
      expect(format(results)).to.contain(
        '##teamcity[testStdOut name=\'ESLint Violations: testfile-warning.js\' out=\'warning: line 1, col 1, Some warning|nline 2, col 2, This is a test warning.\''
      );
    });
  });

  describe('build statistics', function() {
    beforeEach(function() {
      results.push(eslintResultGenerator.createDummyWarning());
      results.push(eslintResultGenerator.createDummyError());
    });

    it('should contain total warning count', function() {
      expect(format(results)).to.contain(
        '##teamcity[buildStatisticValue key=\'ESLintWarningCount\' value=\'2\''
      );
    });

    it('should contain total error count', function() {
      expect(format(results)).to.contain(
        '##teamcity[buildStatisticValue key=\'ESLintErrorCount\' value=\'2\''
      );
    });
  });
});

describe('escaping special characters', function() {
  var results = [];

  afterEach(function() {
    results = [];
  });

  it('should replace specials with TeamCity equivalents', function() {
    results.push(eslintResultGenerator.createDummyError());
    expect(format(results)).to.contain('|\'|n|r|x|l|p|||[|]');
  });
});
