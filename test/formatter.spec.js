/* global it, context, describe, beforeEach, afterEach */

const sinon = require('sinon');
const { expect } = require('chai');
const { createDummyError } = require('./helpers/eslint-result-generator');
const utils = require('../src/utils/index');
const format = require('../src/formatter');

describe('config', () => {
  let results = [];

  beforeEach(() => {
    results.push(createDummyError());
  });

  afterEach(() => {
    results = [];
  });

  context('prop names', () => {
    it('sets the reporter', () => {
      const output = format(results, { reporter: 'inspections' });
      expect(output).to.include(
        "##teamcity[inspectionType id='no-console' category='ESLint Violations' name='no-console' description='ESLint Violations']"
      );
      expect(output).to.include(
        "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
      );
    });

    it('sets the report name', () => {
      const output = format(results, { reportName: 'prop report name' });
      expect(output).to.include("##teamcity[testSuiteStarted name='prop report name']");
      expect(output).to.include("##teamcity[testSuiteFinished name='prop report name']");
    });

    it('sets the error count name', () => {
      const output = format(results, { errorCountName: 'prop errors' });
      expect(output).to.include("##teamcity[buildStatisticValue key='prop errors' value='2']");
    });

    it('sets the warning count name', () => {
      const output = format(results, { warningCountName: 'prop warnings' });
      expect(output).to.include("##teamcity[buildStatisticValue key='prop warnings' value='0']");
    });
  });

  context('package.json', () => {
    beforeEach(() => {
      const jsonConfig = JSON.stringify({
        'eslint-teamcity': {
          reporter: 'inspections',
          'report-name': 'package.json report',
          'error-count-name': 'package.json errors',
          'warning-count-name': 'package.json warnings'
        }
      });
      sinon.stub(utils, 'loadPackageJson').callsFake(() => jsonConfig);
    });

    afterEach(() => {
      utils.loadPackageJson.restore();
    });

    it('sets the report type', () => {
      const output = format(results);
      expect(output).to.include(
        "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
      );
    });

    it('sets the report name', () => {
      const output = format(results);
      expect(output).to.include(
        "##teamcity[inspectionType id='no-console' category='package.json report' name='no-console' description='package.json report']"
      );
    });

    it('sets the error count name', () => {
      const output = format(results);
      expect(output).to.include(
        "##teamcity[buildStatisticValue key='package.json errors' value='2']"
      );
    });

    it('sets the warning count name', () => {
      const output = format(results);
      expect(output).to.include(
        "##teamcity[buildStatisticValue key='package.json warnings' value='0']"
      );
    });
  });

  context('process.env', () => {
    afterEach(() => {
      delete process.env.ESLINT_TEAMCITY_REPORTER;
      delete process.env.ESLINT_TEAMCITY_REPORT_NAME;
      delete process.env.ESLINT_TEAMCITY_ERROR_COUNT_NAME;
      delete process.env.ESLINT_TEAMCITY_WARNING_COUNT_NAME;
    });

    it('sets the report type', () => {
      process.env.ESLINT_TEAMCITY_REPORTER = 'inspections';
      const output = format(results);
      expect(output).to.include(
        "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
      );
    });

    it('sets the report name', () => {
      process.env.ESLINT_TEAMCITY_REPORT_NAME = 'process.env report';
      const output = format(results);
      expect(output).to.include("##teamcity[testSuiteStarted name='process.env report']");
      expect(output).to.include("##teamcity[testSuiteFinished name='process.env report']");
    });

    it('sets the error count name', () => {
      process.env.ESLINT_TEAMCITY_ERROR_COUNT_NAME = 'process.env errors';
      const output = format(results);
      expect(output).to.include(
        "##teamcity[buildStatisticValue key='process.env errors' value='2']"
      );
    });

    it('sets the warning count name', () => {
      process.env.ESLINT_TEAMCITY_WARNING_COUNT_NAME = 'process.env warnings';
      const output = format(results);
      expect(output).to.include(
        "##teamcity[buildStatisticValue key='process.env warnings' value='0']"
      );
    });
  });

  context('defaults', () => {
    it('uses the error reporter', () => {
      const output = format(results);
      expect(output).to.include("##teamcity[testSuiteStarted name='ESLint Violations']");
    });

    it('sets the report name', () => {
      const output = format(results);
      expect(output).to.include("##teamcity[testSuiteStarted name='ESLint Violations']");
      expect(output).to.include("##teamcity[testSuiteFinished name='ESLint Violations']");
    });

    it('sets the error count name', () => {
      const output = format(results);
      expect(output).to.include(
        "##teamcity[buildStatisticValue key='ESLint Error Count' value='2']"
      );
    });

    it('sets the warning count name', () => {
      const output = format(results);
      expect(output).to.include(
        "##teamcity[buildStatisticValue key='ESLint Warning Count' value='0']"
      );
    });
  });
});
