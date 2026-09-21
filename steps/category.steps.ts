import { Given, Then } from '../fixtures/fixtures';

Given('I open the {string} category page', async ({ categoryPage }, slug: string) => {
  await categoryPage.goto(slug);
});

Then('I see the category heading {string}', async ({ categoryPage }, text: string) => {
  await categoryPage.assertHeading(text);
});

Then('I see the products', async ({ categoryPage }) => {
  await categoryPage.verifyProductsAreDisplayed();
});
