var expect = require('chai').expect;
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
          message: 'This is a test error.'
        }
      ],
      filePath: 'testfile.js',
    }
  )
}

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
      )
    });

    it('should include filename at the end of each file test', function() {
      expect(format(results)).to.contain(
        "##teamcity[testFinished name=\'ESLint Violations: testfile.js\']"
      )
    });

    it('should include all errors within their respective file', function() {
      expect(format(results)).to.contain(
        "message='line 1, col 1, |'|n|r|x|l|p|||[|]|nline 2, col 1, This is a test error.'"
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
