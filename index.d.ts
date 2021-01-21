import { ESLint } from "eslint";

declare function format(results: ESLint.LintResult[], { reportName }: { reportName?: string }): string;

export = format;
