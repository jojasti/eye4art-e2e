import { Given, Then } from '../fixtures/fixtures';

Given('I open the {string} page', async ({ seoPage }, path: string) => {
  await seoPage.goto(path);
});

Then('the page has a title', async ({ seoPage }) => {
  await seoPage.assertTitleContains('Eye4Art Studio');
});

Then('the canonical link is correct', async ({ seoPage }) => {
  await seoPage.verifyCanonicalLinkIsCorrect();
});

Then('the meta description is correct', async ({ seoPage }) => {
  await seoPage.verifyMetaDescriptionIsCorrect();
});
