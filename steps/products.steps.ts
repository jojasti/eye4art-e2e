import { Given, Then } from '../fixtures/fixtures';

Given('I open the products page', async ({ productsPage }) => {
  await productsPage.goto();
});

Then('I see the category {string}', async ({ productsPage }, name: string) => {
  await productsPage.verifyCategoryIsDisplayed(name);
});
