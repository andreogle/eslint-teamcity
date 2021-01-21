import { ESLint } from "eslint";

declare namespace ESLintTeamCityReporter {
  function format(results: ESLint.LintResult[], { reportName }: { reportName?: string }): string;

  export default format;
}

export = ESLintTeamCityReporter;
