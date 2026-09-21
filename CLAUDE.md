# eye4art-e2e - rules for the AI agent

E2E tests for https://www.eye4artstudio.com (my furniture workshop site).
Tests run against **production**, so every test must be read-only.

## Stack

Playwright + TypeScript, playwright-bdd (Gherkin), GitHub Actions.

## Commands

- `npm test` - generate BDD tests and run them
- `npm run lint`, `npm run typecheck`, `npm run format`

## Structure

One feature = one steps file = one page object:

```
features/category.feature -> steps/category.steps.ts -> pages/CategoryPage.ts
```

The only shared step is `Given I open the home page`.
Routes go in `pages/constants/links.ts`, other shared values in `pages/constants/generic.ts`.

## Page objects

- Every page object extends `BasePage`
- Static locators are `readonly` fields set in the constructor
- Dynamic locators (that depend on a parameter) are built inside the method
- Assertions live in the page object, in methods named `verify...`
- Each page object has `goto()`
- If a `When` step selects something for a later `Then` step, store it in a private field (see `selectedProduct` in `CategoryPage`)

## Steps

Steps are one line: call one page object method. No locators and no `expect` in steps.
Page objects come from fixtures: `async ({ categoryPage }, value: string) => ...`

## Naming

Use natural, descriptive names. Good: `openCategoryByName`, `verifyOrderButtonIsEnabled`, Examples columns `productCategory`, `categoryName`. Bad: `open`, `slug`, `heading`, `verifyState`.

## Locators

1. `getByTestId` first
2. `getByRole` with name second
3. Text third
4. **Never** CSS classes like `rounded-xl` or `text-zinc-400`

Name matching is case-insensitive substring by default. Watch for collisions (for example "Vertical Vibe" also matches "Vertical Vibe Glass", "Poruči" also matches "Preporuči"). Use anchored regex or `exact: true`.
Never use `.first()` to hide a strict mode violation. Scope the locator instead (search inside the card, not the whole page).

## Test rules

- Always `await`. No `waitForTimeout`. Use web-first assertions (`toBeVisible`, `toHaveCount`), not `count()` + `expect`
- No `if` in tests. A test says "must be", not "if it exists, check"
- Never invent product names, headings or texts. Open the real page with Playwright MCP and read the DOM first
- Gherkin: 2 spaces indent, `Scenario Outline` when only data changes, put `<placeholder>` in the scenario name

## Before you say you are done

1. `npm run format`, `npm run lint`, `npm run typecheck` all pass
2. `npm test` passes
3. Break the new assertion on purpose once and confirm the test fails, then restore it
4. Tell me which files you changed and why

## Never

- Never commit or push. I review everything first
- Never submit a real form without mocking the request with `page.route`
- Never disable a lint rule or install with `--force` / `--legacy-peer-deps`
- Never change the website repo, only this one
