![E2E tests](https://github.com/jojasti/eye4art-e2e/actions/workflows/e2e.yml/badge.svg)

# eye4art-e2e

End-to-end tests for [eye4artstudio.com](https://www.eye4artstudio.com), the website of my handmade furniture workshop in Belgrade.

I built this framework from zero to practice setting up test automation myself, not just writing tests inside something that already exists. The site is real and live, so the tests check real things that matter to real customers.

## What it covers

Navigation, the products page, every category page, the home page, the contact page, the footer, the blog, the English version of the site, and SEO metadata on every prerendered page.

Everything runs on two projects: desktop Chromium and mobile Safari (iPhone 14).

## Stack

- **Playwright** + **TypeScript**
- **playwright-bdd** for Cucumber / Gherkin feature files
- **GitHub Actions** for CI
- **Allure** and the Playwright HTML report
- **ESLint**, **Prettier**, **Husky** for code quality

## Why these choices

**playwright-bdd instead of the classic Cucumber runner.** Playwright stays the main runner, so I get trace viewer, fixtures, parallel runs and the HTML report out of the box.

**Tests in a separate repo.** They only know the public website, not the source code.

**TypeScript pinned to 6.0.** TypeScript 7 is out, but typescript-eslint does not support it yet. I pinned the version instead of forcing the install, because that would only hide the problem.

**Playwright ESLint rules.** Rules I wrote down for myself are only words. `no-wait-for-timeout`, `prefer-web-first-assertions` and `missing-playwright-await` are checked by a tool on every commit.

**Test IDs in the app.** When a locator depended on how I named my products, it broke as soon as a product had a different name. So I added `data-testid="product-card"` to the website itself.

**Mobile is not a copy of desktop.** Adding the iPhone project showed that the mobile menu links live outside the `nav` element and are hidden behind the hamburger button. The page object opens it when needed.

## Project structure

```
features/          Gherkin feature files, one per page
steps/             Step definitions, one file per feature
pages/             Page objects
  BasePage.ts      Shared helpers
  constants/       Routes and shared values
fixtures/          Playwright fixtures that create page objects
scripts/           Failure email summary
.claude/           Agent rules and subagents
.github/workflows/ CI pipeline
```

Each feature has its own steps file and its own page object. The only shared step is opening the home page.

## Running locally

Requires Node 22 or newer.

```bash
npm install
npx playwright install chromium webkit
npm test
```

Other commands:

```bash
npm run test:headed    # watch the browser
npm run test:ui        # Playwright UI mode
npm run report         # open the last HTML report
npm run allure:single  # build a single-file Allure report
npm run lint
npm run typecheck
npm run format
```

## CI

GitHub Actions runs everything on every push, on pull requests, and every day at 06:00 UTC. The daily run matters because the tests check the live site, and the site can change without any change in this repo.

Pipeline: `npm ci` → lint → typecheck → format check → tests → reports as artifacts.

**If a test fails, I get an email** with which test failed, what was expected, what the page actually showed, and a screenshot from production.

`main` is protected: no direct pushes, every change goes through a pull request with a passing CI check.

## Running against production safely

- **Analytics are blocked.** Every test request to Microsoft Clarity and Google Analytics is aborted, so test runs do not show up as real visitors in my stats. I checked this in the trace network tab, not just assumed it.
- **EmailJS is blocked too**, globally in the fixture, so no test can ever send a real message through the contact form.
- **Tests only read.** No test submits a form or changes data.

## Working with an AI agent

I use Claude Code to write test batches from a plan in `TEST_PLAN.md`. The agent is not trusted on its own, the system around it is:

- `CLAUDE.md` holds the rules: locator order, no `waitForTimeout`, no `if` in tests, never invent page text, prove every new assertion can fail
- A separate `test-reviewer` subagent reviews each batch against the mistakes I actually hit, and it has no write tools
- A `ci-triage` subagent investigates failed CI runs and says whether the site changed, the site broke, or the test is wrong. It never fixes anything
- The agent works on a branch and opens a PR. It cannot merge, and it cannot push to `main`
- I read the diff and I click merge

When the site behaves differently than expected, that goes into `FINDINGS.md` as a finding, never into the test as a lowered expectation.

## What this caught

Real problems found on the site while building this: duplicate meta description and OG tags on every page, a category intro that said five models when there were seven, a footer link that promised cabinets and delivered side tables, and a product described as new while it was discontinued.
