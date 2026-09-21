![E2E tests](https://github.com/jojasti/eye4art-e2e/actions/workflows/e2e.yml/badge.svg)

# eye4art-e2e

End-to-end tests for [eye4artstudio.com](https://www.eye4artstudio.com), the website of my handmade furniture workshop in Belgrade.

I built this framework from zero to practice setting up test automation myself, not just writing tests inside something that already exists. The site is real and live, so the tests check real things that matter to real customers.

## What it tests

- **Navigation** - every main menu link opens the right page
- **Products page** - all five product categories are shown
- **Category pages** - each category opens with the right heading and shows products
- **Ordering** - every available model has an active order button

22 tests right now, all running against production.

## Stack

- **Playwright** + **TypeScript**
- **playwright-bdd** for Cucumber / Gherkin feature files
- **GitHub Actions** for CI
- **ESLint**, **Prettier**, **Husky** for code quality

## Why these choices

**playwright-bdd instead of the classic Cucumber runner.** Playwright stays the main runner, so I get trace viewer, fixtures, parallel runs and the HTML report out of the box. With the Cucumber runner you have to glue all of that together yourself.

**Tests in a separate repo.** The tests are black-box. They only know the public website, not the source code, so they live on their own.

**TypeScript pinned to 6.0.** TypeScript 7 came out, but typescript-eslint does not support it yet. I pinned the version instead of forcing the install with `--force`, because that would only hide the problem.

**No gherkin-lint.** I tried it, but it pulled old dependencies with a critical vulnerability. Gherkin syntax is already checked by `bddgen`, so it was not worth the risk in a public repo.

**`no-floating-promises` in ESLint.** A missing `await` gives you a green test that did not actually check anything. This rule makes that impossible.

**Test IDs in the app.** When a locator depended on how I named my products, it broke as soon as a product had a different name. So I added `data-testid="product-card"` to the website itself. Testability is part of the app, not only the tests.

## Project structure

```
features/          Gherkin feature files, one per page
steps/             Step definitions, one file per feature
pages/             Page objects
  BasePage.ts      Shared helpers (open page, check title, heading, URL)
  constants/       Route links and shared values
fixtures/          Playwright fixtures that create page objects
scripts/           Failure email summary
.github/workflows/ CI pipeline
```

Each feature has its own steps file and its own page object. The only shared step is opening the home page.

## Running locally

Requires Node 22 or newer.

```bash
npm install
npx playwright install chromium
npm test
```

Other commands:

```bash
npm run test:headed    # watch the browser
npm run test:ui        # Playwright UI mode
npm run report         # open the last HTML report
npm run lint
npm run typecheck
npm run format
```

## CI

GitHub Actions runs everything on every push, on pull requests, and **every day at 06:00 UTC**. The daily run matters because the tests check the live site, and the site can change without any change in this repo.

Pipeline: `npm ci` → lint → typecheck → format check → tests → HTML report as artifact (kept 14 days).

**If a test fails, I get an email** with:

- which test failed and on which step
- what was expected and what the page actually showed
- a screenshot from production

So from the email alone I can tell how serious it is before I open anything.

## Running against production safely

- **Analytics are blocked.** Every test request to Microsoft Clarity and Google Analytics is aborted, so test runs do not show up as real visitors in my stats. I checked this in the trace network tab, not just assumed it.
- **Tests only read.** No test sends forms or changes data. Contact form tests will mock the network calls when I add them.

## What's next

- Contact form tests with network mocking
- Product quiz tests
- SEO checks (title, canonical, meta description on prerendered pages)
- `@critical` tags, so the failure email says right away if a business-critical flow broke
- An AI agent that writes new tests from a plain request and helps triage failures, with me reviewing every change
