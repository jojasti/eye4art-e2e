import { Given, Then, When } from '../fixtures/fixtures';

Given('I open the home page', async ({ homePage }) => {
  await homePage.goto();
});

Then('the page title contains {string}', async ({ homePage }, text: string) => {
  await homePage.assertTitleContains(text);
});

When('I open the explore products link', async ({ homePage }) => {
  await homePage.openExploreProducts();
});

Then('I am taken to the products page', async ({ homePage }) => {
  await homePage.verifyOnProductsPage();
});

When('I open the view all turntable models link', async ({ homePage }) => {
  await homePage.openViewAllTurntableModels();
});

Then('I am taken to the turntable-shelves category page', async ({ homePage }) => {
  await homePage.verifyOnTurntableShelvesPage();
});

When(
  'I open the {string} category from the products grid',
  async ({ homePage }, categoryName: string) => {
    await homePage.openCategoryFromGrid(categoryName);
  },
);

Then('I land on the {string} category page', async ({ homePage }, productCategory: string) => {
  await homePage.verifyOnCategoryPage(productCategory);
});

Then('the reviews rating is shown', async ({ homePage }) => {
  await homePage.verifyReviewsRatingIsShown();
});

Then('reviews have text and author', async ({ homePage }) => {
  await homePage.verifyReviewsHaveTextAndAuthor();
});
