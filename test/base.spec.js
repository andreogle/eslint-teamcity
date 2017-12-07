// const { expect } = require('chai');
// const format = require('../src/formatter');
// const {
//   createDummyError,
//   createDummyWarning,
//   createFatalError,
// } = require('./helpers/eslint-result-generator');

// describe('formatting', () => {
//   let results = [];
//
//   afterEach(() => {
//     results = [];
//   });
//
//   describe('test suite name', () => {
//     it('should include the test suite name header', () => {
//       expect(format(results)).to.contain(
//         "##teamcity[testSuiteStarted name='ESLint Violations']"
//       );
//     });
//
//     it('should include the test suite name footer', () => {
//       expect(format(results)).to.contain(
//         "##teamcity[testSuiteFinished name='ESLint Violations']"
//       );
//     });
//   });
// });
//
// describe('escaping special characters', () => {
//   let results = [];
//
//   afterEach(() => {
//     results = [];
//   });
//
//   it('should replace specials with TeamCity equivalents', () => {
//     results.push(eslintResultGenerator.createDummyError());
//     expect(format(results)).to.contain("|'|n|r|x|l|p|||[|]");
//   });
// });
