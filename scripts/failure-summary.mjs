import { readFileSync, writeFileSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';

const report = JSON.parse(readFileSync('test-results/results.json', 'utf8'));
const stripColors = (text) => stripVTControlCharacters(text);
const failures = [];

function collectFailures(suite, parentTitles, isFileSuite) {
  const titles = isFileSuite ? parentTitles : [...parentTitles, suite.title];

  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      if (test.status !== 'unexpected') continue;
      const lastResult = test.results.at(-1);
      const errorMessage = stripColors(lastResult?.error?.message ?? 'No error message');
      failures.push({
        title: [...titles, spec.title].join(' › '),
        error: errorMessage.split('\n').slice(0, 8).join('\n'),
      });
    }
  }

  for (const childSuite of suite.suites ?? []) {
    collectFailures(childSuite, titles, false);
  }
}

for (const fileSuite of report.suites) {
  collectFailures(fileSuite, [], true);
}

const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
const runLink = GITHUB_RUN_ID
  ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
  : 'local run';

const lines = [
  `## ${failures.length} failed test(s) on eye4artstudio.com`,
  '',
  `**Run:** ${runLink}`,
  '',
];
failures.forEach((failure, index) => {
  lines.push(`### ${index + 1}. ${failure.title}`, '', '```', failure.error, '```', '');
});
lines.push('Screenshots from production are attached.');

writeFileSync('summary.md', lines.join('\n'));
writeFileSync('subject.txt', `E2E FAILED: ${failures.length} test(s) on eye4artstudio.com`);
console.log(lines.join('\n'));
