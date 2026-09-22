import { Given, Then, When } from '../fixtures/fixtures';

Given('I open the {string} category page', async ({ categoryPage }, productCategory: string) => {
  await categoryPage.goto(productCategory);
});

Then('I see the category heading {string}', async ({ categoryPage }, categoryName: string) => {
  await categoryPage.assertHeading(categoryName);
});

Then('I see the products', async ({ categoryPage }) => {
  await categoryPage.verifyProductsAreDisplayed();
});

When('I find the {string} product', async ({ categoryPage }, model: string) => {
  await categoryPage.findProductByModel(model);
});

Then('the order button is enabled', async ({ categoryPage }) => {
  await categoryPage.verifyOrderButtonIsEnabled();
});

Then(
  'the order button shows {string} and is disabled',
  async ({ categoryPage }, buttonText: string) => {
    await categoryPage.verifyOrderButtonIsDisabled(buttonText);
  },
);

Then('every product shows an allowed stock status', async ({ categoryPage }) => {
  await categoryPage.verifyEveryProductShowsAllowedStockStatus();
});

When('I go back to the products index', async ({ categoryPage }) => {
  await categoryPage.goBackToProducts();
});

Then('I am back on the products page', async ({ categoryPage }) => {
  await categoryPage.verifyOnProductsPage();
});

When('I open the quiz', async ({ categoryPage }) => {
  await categoryPage.openQuiz();
});

Then('the quiz modal is open', async ({ categoryPage }) => {
  await categoryPage.verifyQuizModalIsOpen();
});

When('I close the quiz', async ({ categoryPage }) => {
  await categoryPage.closeQuiz();
});

Then('the quiz modal is closed', async ({ categoryPage }) => {
  await categoryPage.verifyQuizModalIsClosed();
});

Then('materials are shown', async ({ categoryPage }) => {
  await categoryPage.verifyMaterialsAreShown();
});

Then('dimensions are shown', async ({ categoryPage }) => {
  await categoryPage.verifyDimensionsAreShown();
});

Then('the price is shown', async ({ categoryPage }) => {
  await categoryPage.verifyPriceIsShown();
});
