/* global it, describe, context */

const fs = require('fs');
const { expect } = require('chai');
const sinon = require('sinon');
const utils = require('../../src/utils');

describe('utils', function() {
  describe('loadPackageJson', () => {
    context('success', function() {
      it('returns a string representation of package.json', function() {
        sinon.stub(fs, 'readFileSync').callsFake(() => 'package.json contents');
        expect(utils.loadPackageJson()).to.eql('package.json contents');
        fs.readFileSync.restore();
      });
    });

    context('failure', function() {
      it('returns an empty object representation', function() {
        sinon.stub(fs, 'readFileSync').throws();
        expect(utils.loadPackageJson()).to.eql('{}');
        fs.readFileSync.restore();
      });
    });
  });

  describe('escapeTeamCityString', function() {
    it('returns empty strings', function() {
      expect(utils.escapeTeamCityString(null)).to.eql('');
    });

    it('replaces TeamCity special characters', function() {
      expect(utils.escapeTeamCityString("'\n\r\u0085\u2028\u2029|[]")).to.eql("|'|n|r|x|l|p|||[|]");
    });
  });
});
