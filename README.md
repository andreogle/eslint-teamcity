# eslint-teamcity
[![npm version](https://badge.fury.io/js/eslint-teamcity.svg)](https://www.npmjs.com/package/eslint-teamcity)
[![Build Status](https://travis-ci.org/andreogle/eslint-teamcity.svg?branch=master)](https://travis-ci.org/andreogle/eslint-teamcity)
[![Coverage Status](https://coveralls.io/repos/github/andreogle/eslint-teamcity/badge.svg?branch=master)](https://coveralls.io/github/andreogle/eslint-teamcity?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/eslint-teamcity.svg)](https://www.npmjs.com/package/eslint-teamcity)

> A small [eslint](https://github.com/eslint/eslint) formatter plugin.
ESLint violations are output nicely in the
[TeamCity](https://www.jetbrains.com/teamcity/) build error format. Tested with
TeamCity 9.1.x/10.0.x/2017 and ESLint 1+

## Installation

**As of v2.0, Node v6+ is required. If you use an older version of Node, please stick with v1.x**

Prerequisite: You must have either [npm](https://docs.npmjs.com/getting-started/installing-node#install-npm--manage-npm-versions) or [Yarn](https://yarnpkg.com/en/docs/install) installed.

```sh
npm install eslint-teamcity --save-dev
```

## Usage
There are 3 ways to use eslint-teamcity:
##### 1. As a regular ESLint formatter plugin:
```sh
eslint --format ./node_modules/eslint-teamcity/index.js myfiletolint.js
```
##### 2. Running against a generated ESLint JSON report:
Generate an ESLint JSON report:
```sh
eslint -f json -o result.json app/myjavascriptdirectory
```
Run eslint-teamcity against your new report:
```sh
node ./node_modules/eslint-teamcity/index.js result.json
```
##### 3. Requiring and running directly from inside your JavaScript code:
```javascript
const eslintTeamcity = require('eslint-teamcity');
console.log(eslintTeamcity(eslintOutput));
```

## Configuration
As of version 2.0, there are two different formatters you can use to report with. They have no material
impact on the output - they're just different ways of viewing the same data. The "Code Inspection" tab will only
appear if you have configured eslint-teamcity to use the inspections reporter.

Errors (default)             |  Inspections
:-------------------------:|:-------------------------:
![Example Errors Report](https://i.imgur.com/3AzQeMy.png)  |  ![Example Inspections Report](https://i.imgur.com/JXzBuaV.png)

There are several ways that you can configure eslint-teamcity. **You don't have to configure anything by default**, you just have the option to if you would like.
Settings are looked for in the following priority:

##### 1. As a second argument
If you run eslint-teamcity by requiring it in JavaScript, you can pass a second argument to the function:
```javascript
const eslintTeamcity = require('eslint-teamcity');
const options = {
  reporter: 'inspections', // default: 'errors'
  reportName: 'My ESLint Violations', // default: 'ESLint Violations'
  errorStatisticsName: 'My ESLint Error Count', // default: 'ESLint Error Count' 
  warningStatisticsName: 'My ESLint Warning Count', // default: 'ESLint Warning Count'
};
console.log(eslintTeamcity(eslintOutput, options));
```

##### 2. From your package.json
If you have a package.json file in the **current directory**, you can add an extra "eslint-teamcity" property to it:
```json
...,
"eslint-teamcity": {
  "reporter": "inspections",
  "report-name": "My ESLint Violations",
  "error-statistics-name": "My ESLint Error Count",
  "warning-statistics-name": "My ESLint Warning Count"
},
...
```

##### 3. ENV variables
```bash
export ESLINT_TEAMCITY_REPORTER=inspections
export ESLINT_TEAMCITY_REPORT_NAME="My Formatting Problems"
export ESLINT_TEAMCITY_ERROR_STATISTICS_NAME="My Error Count"
export ESLINT_TEAMCITY_WARNING_STATISTICS_NAME="My Warning Count"
```

You can also output your current settings to the log if you set:
```bash
export ESLINT_TEAMCITY_DISPLAY_CONFIG=true
```


## [gulp-eslint](https://github.com/adametry/gulp-eslint) integration
```javascript
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const teamcity = require('eslint-teamcity');

gulp.task('lint', function () {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format(teamcity))
    .pipe(eslint.failAfterError());
});
```
See the [gulp-eslint](https://github.com/adametry/gulp-eslint#usage) docs for
more info on setting up a linting task.


## TeamCity Usage
The simplest way to run eslint-teamcity is from an npm script in a build step. You could setup a script similar to this:
```json
"scripts": {
  "lint:teamcity": "eslint app/src --format './node_modules/eslint-teamcity/index.js'"
}
```

You could also run it as a gulp task (if you use [gulp](https://github.com/gulpjs/gulp) and [gulp-eslint](https://github.com/adametry/gulp-eslint)):

![Example TeamCity Setup](https://i.imgur.com/R3ypYXu.png)
Kick off a new build, by deploying again, and you should see your build errors - assuming you have any!


## Extras
eslint-teamcity will also output statistic values which you can use in TeamCity to track your progress in resolving errors!

Graphs can be setup from the Build -> Statistics tab.
![Example Statistics Output](http://i.imgur.com/oHbiuZE.png)


## Development
The quickest way to get a TeamCity server setup is to use Docker:
```shell
docker run -itd --name teamcity-server  \
    -v <path to data directory>:/data/teamcity_server/datadir \
    -v <path to logs directory>:/opt/teamcity/logs  \
    -p 8111:8111 \
    jetbrains/teamcity-server

docker run -itd -e SERVER_URL="<your ip4 address>:8111"  \ 
    -v <path to agent config folder>:/data/teamcity_agent/conf  \      
    jetbrains/teamcity-agent
```

If you fork the repo and are testing on your local TeamCity instance, it may help to run `rm -rf node_modules` in a
build step as TeamCity seems to cache versions between commits.


## Issues
I will try keep this project up to date, but please log any issues
[here](https://github.com/andreogle/eslint-teamcity/issues).
Any pull requests are also welcome!
