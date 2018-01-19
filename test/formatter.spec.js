/* global it, context, describe, beforeEach, afterEach */

const sinon = require('sinon');
const { expect } = require('chai');
const { createDummyError } = require('./helpers/eslint-factory');
const utils = require('../src/utils/index');
const format = require('../src/formatter');

describe('formatter', function() {
  describe('config', function() {
    let eslintInput = [];

    beforeEach(function() {
      eslintInput.push(createDummyError());
    });

    afterEach(function() {
      eslintInput = [];
    });

    context('prop names', function() {
      it('sets the reporter', function() {
        const output = format(eslintInput, { reporter: 'inspections' });
        expect(output).to.include(
          "##teamcity[inspectionType id='no-console' category='ESLint Violations' name='no-console' description='ESLint Violations']"
        );
        expect(output).to.include(
          "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
        );
      });

      it('sets the report name', function() {
        const output = format(eslintInput, { reportName: 'prop report name' });
        expect(output).to.include("##teamcity[testSuiteStarted name='prop report name']");
        expect(output).to.include("##teamcity[testSuiteFinished name='prop report name']");
      });

      it('sets the error count name', function() {
        const output = format(eslintInput, { errorStatisticsName: 'prop errors' });
        expect(output).to.include("##teamcity[buildStatisticValue key='prop errors' value='2']");
      });

      it('sets the warning count name', function() {
        const output = format(eslintInput, { warningStatisticsName: 'prop warnings' });
        expect(output).to.include("##teamcity[buildStatisticValue key='prop warnings' value='0']");
      });
    });

    context('package.json', function() {
      beforeEach(function() {
        const jsonConfig = JSON.stringify({
          'eslint-teamcity': {
            reporter: 'inspections',
            'report-name': 'package.json report',
            'error-statistics-name': 'package.json errors',
            'warning-statistics-name': 'package.json warnings'
          }
        });
        sinon.stub(utils, 'loadPackageJson').callsFake(() => jsonConfig);
      });

      afterEach(function() {
        utils.loadPackageJson.restore();
      });

      it('sets the report type', function() {
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
        );
      });

      it('sets the report name', function() {
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[inspectionType id='no-console' category='package.json report' name='no-console' description='package.json report']"
        );
      });

      it('sets the error count name', function() {
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[buildStatisticValue key='package.json errors' value='2']"
        );
      });

      it('sets the warning count name', function() {
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[buildStatisticValue key='package.json warnings' value='0']"
        );
      });
    });

    context('process.env', function() {
      function cleanup() {
        delete process.env.ESLINT_TEAMCITY_REPORTER;
        delete process.env.ESLINT_TEAMCITY_REPORT_NAME;
        delete process.env.ESLINT_TEAMCITY_ERROR_STATISTICS_NAME;
        delete process.env.ESLINT_TEAMCITY_WARNING_STATISTICS_NAME;
      }

      beforeEach(() => cleanup());
      afterEach(() => cleanup());

      it('sets the report type', function() {
        process.env.ESLINT_TEAMCITY_REPORTER = 'inspections';
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
        );
      });

      it('sets the report name', function() {
        process.env.ESLINT_TEAMCITY_REPORT_NAME = 'process.env report';
        const output = format(eslintInput);
        expect(output).to.include("##teamcity[testSuiteStarted name='process.env report']");
        expect(output).to.include("##teamcity[testSuiteFinished name='process.env report']");
      });

      it('sets the error count name', function() {
        process.env.ESLINT_TEAMCITY_ERROR_STATISTICS_NAME = 'process.env errors';
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[buildStatisticValue key='process.env errors' value='2']"
        );
      });

      it('sets the warning count name', function() {
        process.env.ESLINT_TEAMCITY_WARNING_STATISTICS_NAME = 'process.env warnings';
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[buildStatisticValue key='process.env warnings' value='0']"
        );
      });
    });

    context('defaults', function() {
      it('uses the error reporter', function() {
        const output = format(eslintInput);
        expect(output).to.include("##teamcity[testSuiteStarted name='ESLint Violations']");
      });

      it('sets the report name', function() {
        const output = format(eslintInput);
        expect(output).to.include("##teamcity[testSuiteStarted name='ESLint Violations']");
        expect(output).to.include("##teamcity[testSuiteFinished name='ESLint Violations']");
      });

      it('sets the error count name', () => {
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[buildStatisticValue key='ESLint Error Count' value='2']"
        );
      });

      it('sets the warning count name', function() {
        const output = format(eslintInput);
        expect(output).to.include(
          "##teamcity[buildStatisticValue key='ESLint Warning Count' value='0']"
        );
      });
    });
  });
});
