/* global it, describe, beforeEach, afterEach */

const { expect } = require('chai');
const sh = require('shelljs');
const path = require('path');
const fs = require('fs-extra');
const { createDummyError } = require('./helpers/eslint-factory');

const basePath = path.resolve(__dirname, '..');
const pathToTestJson = path.resolve(__dirname, 'result.json');
const pathToIndex = path.resolve(__dirname, '..', 'index.js');

describe('smoke tests', () => {
  describe('support interface', () => {
    let esLintOutput = [];

    beforeEach(() => {
      esLintOutput.push(createDummyError());
    });

    afterEach(() => {
      esLintOutput = [];
    });

    describe('cmd', () => {
      it('as eslint formatter plugin', () => {
        const result = sh.exec(`eslint --format '${pathToIndex}' ${pathToIndex}`);
        expect(result.stdout).to.contain('##teamcity');
      });

      it('as standalone', () => {
        fs.writeJSONSync(pathToTestJson, esLintOutput);
        const result = sh.exec(`cd ${basePath}; node index.js ${pathToTestJson}`);
        expect(result.stdout).to.contain('##teamcity');
        expect(result.stderr).to.equal('');

        sh.rm(pathToTestJson);
      });
    });

    describe('requirejs', () => {
      it('basic', () => {
        const result = require(pathToIndex)(esLintOutput);
        expect(result).to.contain('##teamcity');
      });

      it('with parameters', () => {
        const teamcityPropNames = {
          errorStatisticsName: 'EslintInspectionStatsE',
          warningStatisticsName: 'EslintInspectionStatsW'
        };

        const result = require(pathToIndex)(esLintOutput, teamcityPropNames);
        expect(result).to.contain('ESLint Violations');
        expect(result).to.contain('EslintInspectionStatsE');
        expect(result).to.contain('EslintInspectionStatsW');
      });
    });
  });
});
