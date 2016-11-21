var expect = require('chai').expect;
var sinon = require('sinon');
var format = require('../src/formatter');

var createDummyError = function() {
  return (
    {
      messages: [
        {
          severity: 2, // error
          line: 1,
          column: 1,
          message: '\'\n\r\u0085\u2028\u2029|[]'
        },
        {
          severity: 2, // error
          line: 2,
          column: 1,
          message: 'This is a test error.',
          ruleId: 'no-unreachable'
        }
      ],
      filePath: 'testfile.js'
    }
  );
};

var createFatalError = function() {
  return (
    {
      messages: [
        {
          fatal: true, // usually omitted, but will be set to true if there's a parsing error (not related to a rule)
          line: 1,
          column: 1,
          message: 'Some fatal error'
        }
      ],
      filePath: 'testfile-fatal.js'
    }
  );
};

var createDummyWarning = function() {
  return (
    {
      messages: [
        {
          severity: 1, // warning
          line: 1,
          column: 1,
          message: 'Some warning'
        },
        {
          severity: 1, // warning
          line: 2,
          column: 2,
          message: 'This is a test warning.'
        }
      ],
      filePath: 'testfile-warning.js'
    }
  );
};

describe('formatting', function() {
  var results = [];

  afterEach(function() {
    results = [];
  });

  describe('test suite name', function() {
    it('should include the test suite name header', function() {
      expect(format(results)).to.contain(
        "##teamcity[testSuiteStarted name='ESLint Violations']"
      );
    });

    it('should include the test suite name footer', function() {
      expect(format(results)).to.contain(
        "##teamcity[testSuiteFinished name='ESLint Violations']"
      );
    });
  });

  describe('file error output', function() {
    beforeEach(function() {
      results.push(createDummyError());
    });

    it('should include filename at the start of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testStarted name=\'ESLint Violations: testfile.js\']"
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testFinished name=\'ESLint Violations: testfile.js\']"
      );
    });

    it('should include all errors within their respective file', function() {
      expect(format(results)).to.contain(
        "message='line 1, col 1, |'|n|r|x|l|p|||[|]|nline 2, col 1, This is a test error. (no-unreachable)'"
      );
    });
  });

  describe('file fatal error output', function() {
    beforeEach(function() {
      results.push(createFatalError());
    });

    it('should include filename at the start of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testStarted name=\'ESLint Violations: testfile-fatal.js\']"
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testFinished name=\'ESLint Violations: testfile-fatal.js\']"
      );
    });

    it('should include all errors within their respective file', function() {
      expect(format(results)).to.contain(
        "message='line 1, col 1, Some fatal error'"
      );
    });
  });

  describe('file warning output', function() {
    beforeEach(function() {
      results.push(createDummyWarning());
    });

    it('should include filename at the start of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testStarted name='ESLint Violations: testfile-warning.js']"
      );
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testFinished name=\'ESLint Violations: testfile-warning.js\']"
      );
    });

    it('should include all warnings within their respective file', function() {
      expect(format(results)).to.contain(
        "##teamcity[testStdOut name='ESLint Violations: testfile-warning.js' out='warning: line 1, col 1, Some warning|nline 2, col 2, This is a test warning.'"
      );
    });
  });

  describe('build statistics', function() {
    beforeEach(function() {
      results.push(createDummyWarning());
      results.push(createDummyError());
    });

    it('should contain total warning count', function() {
      expect(format(results)).to.contain(
        "##teamcity[buildStatisticValue key=\'ESLintWarningCount\' value=\'2\'"
      );
    });

    it('should contain total error count', function() {
      expect(format(results)).to.contain(
        "##teamcity[buildStatisticValue key=\'ESLintErrorCount\' value=\'2\'"
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
    results.push(createDummyError());
    expect(format(results)).to.contain('|\'|n|r|x|l|p|||[|]');
  });
});
