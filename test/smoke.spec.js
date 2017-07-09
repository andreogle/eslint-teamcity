var expect = require('chai').expect;
var sinon = require('sinon');
var sh = require('shelljs');
var path = require('path');
var basePath = path.resolve(__dirname, '..');
var helper = require('./generateEsLintResult');
var fs = require('fs-extra');
var pathToTestJson = path.resolve(__dirname, 'result.json');
var pathToIndex = path.resolve(__dirname, '..', 'index.js');
var input = [];
var result;
describe('support interface',function() {

  before(function() {
    input.push(helper.createDummyError());
  });

  describe('cmd',function() {
    it('as eslint formatter', function() {
      result = sh.exec('eslint --format ' + '\'' + pathToIndex + '\' ' + pathToIndex);
      expect(result.stdout).to.contain('##teamcity');
    });

    it('as standalone',function() {
      fs.writeJSONSync(pathToTestJson, input);
      result = sh.exec('cd ' + basePath + '; node ' + 'index.js ' + pathToTestJson);
      expect(result.stdout).to.contain('##teamcity');
      expect(result.stderr).to.equal('');

      sh.rm(pathToTestJson);
    });
  });

  describe('requirejs',function() {
    it('basic', function() {
      result = require(pathToIndex)(input);
      expect(result).to.contain('##teamcity');
    });

    it('with parameters', function() {
      var parameters = {
        errorCountName: 'EslintInspectionStatsE',
        warningCountName: 'EslintInspectionStatsW'

      };
      result = require(pathToIndex)(input, parameters);
      expect(result).to.contain('ESLint Violations');
      expect(result).to.contain('EslintInspectionStatsE');
      expect(result).to.contain('EslintInspectionStatsW');
    });

  });
});