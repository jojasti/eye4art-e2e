import { Given, Then, When } from '../fixtures/fixtures';

Given('I open the products page', async ({ productsPage }) => {
  await productsPage.goto();
});

Then('I see the category {string}', async ({ productsPage }, name: string) => {
  await productsPage.verifyCategoryIsDisplayed(name);
});

When('I open the {string} category', async ({ productsPage }, categoryName: string) => {
  await productsPage.openCategoryByName(categoryName);
});

Then('I am on the {string} category page', async ({ productsPage }, productCategory: string) => {
  await productsPage.verifyOnCategoryPage(productCategory);
});
