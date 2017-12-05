const expect = require('chai').expect;
const sinon = require('sinon');
const format = require('../src/formatter');
const { createDummyError, createDummyWarning, createFatalError } = require('./helpers/eslint-result-generator');

describe('formatting', () => {
  let results = [];

  afterEach(() => {
    results = [];
  });

  describe('test suite name', () => {
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

});

describe('escaping special characters', function() {
  let results = [];

  afterEach(function() {
    results = [];
  });

  it('should replace specials with TeamCity equivalents', function() {
    results.push(eslintResultGenerator.createDummyError());
    expect(format(results)).to.contain('|\'|n|r|x|l|p|||[|]');
  });
});
