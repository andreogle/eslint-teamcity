exports.unknownError = {
  messages: [
    {
      fatal: true, // usually omitted, but will be set to true if there's a parsing error
      line: 1,
      column: 1,
      message: 'Some unknown error',
      // For example, if the ecmaVersion is set to 5 and ES6+ syntax is used, then ESLint
      // would fail to parse the file
      ruleId: null,
    },
  ],
  filePath: 'testfile-unknown.js',
};

exports.fatalError = {
  messages: [
    {
      fatal: true, // usually omitted, but will be set to true if there's a parsing error
      line: 1,
      column: 1,
      message: 'Some fatal error',
      ruleId: 'no-eval',
    },
  ],
  filePath: 'testfile-fatal.js',
};

exports.error = {
  messages: [
    {
      severity: 2, // error
      line: 1,
      column: 1,
      message: "'\n\r\u0085\u2028\u2029|[]",
      ruleId: 'no-console',
    },
    {
      severity: 2, // error
      line: 2,
      column: 1,
      message: 'This is a test error.',
      ruleId: 'no-unreachable',
    },
  ],
  filePath: 'testfile.js',
};

exports.warning = {
  messages: [
    {
      severity: 1, // warning
      line: 1,
      column: 1,
      message: 'Some warning',
      ruleId: 'eqeqeq',
    },
    {
      severity: 1, // warning
      line: 2,
      column: 2,
      message: 'This is a test warning.',
      ruleId: 'complexity',
    },
  ],
  filePath: 'testfile-warning.js',
};
