# eslint-teamcity
[![npm version](https://badge.fury.io/js/eslint-teamcity.svg)](https://www.npmjs.com/package/eslint-teamcity)
[![Build Status](https://travis-ci.org/andreogle/eslint-teamcity.svg?branch=master)](https://travis-ci.org/andreogle/eslint-teamcity)
[![Coverage Status](https://coveralls.io/repos/github/andreogle/eslint-teamcity/badge.svg?branch=master)](https://coveralls.io/github/andreogle/eslint-teamcity?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/eslint-teamcity.svg)](https://www.npmjs.com/package/eslint-teamcity)

> A small [eslint](https://github.com/eslint/eslint) formatter plugin.
ESLint violations are output nicely in the
[TeamCity](https://www.jetbrains.com/teamcity/) build error format. Tested with
TeamCity 9.1.x/10.0.x/2017 and ESLint 1/2/3/4.

## Installation

[Use npm](https://docs.npmjs.com/cli/install).

```sh
npm install eslint-teamcity --save-dev
```

## Usage
```sh
  eslint --format './node_modules/eslint-teamcity/index.js' myfiletolint.js
```

## [gulp-eslint](https://github.com/adametry/gulp-eslint) integration
```javascript
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    teamcity = require('eslint-teamcity');

gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format(teamcity))
        .pipe(eslint.failAfterError());
});
```
See the [gulp-eslint](https://github.com/adametry/gulp-eslint#usage) docs for
more info on setting up a linting task.


## TeamCity usage (with [gulp-eslint](http://github.com/adametry/gulp-eslint))
Add a gulp task to run ESLint (see above)

Setup a TeamCity build step, similar to the below screenshot:

![Example TeamCity Setup](https://i.imgur.com/j7qMSYg.jpg)

Kick off a new build, by deploying again, and you should see your build errors - assuming you have any!

#### Screenshot with TeamCity

![Example TeamCity Output](https://i.imgur.com/DkwEPEN.jpg)

## Extras

eslint-teamcity will also output statistic values which you can use in TeamCity to track your progress in resolving errors!

Graphs can be setup from the Builds -> Statistics tab.
![Example Statistics Output](http://i.imgur.com/oHbiuZE.png)

## Issues

I will try keep this project up to date, but please log any issues
[here](https://github.com/andreogle/eslint-teamcity/issues).
Any pull requests are also welcome!
