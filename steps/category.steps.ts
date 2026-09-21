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
