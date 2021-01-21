import { ESLint } from "eslint";

interface Options {
  reporter?: string;
  reportName?: string;
  errorStatisticsName?: string;
  warningStatisticsName?: string;
}

declare function format(results: ESLint.LintResult[], options?: Options): string;

export = format;
