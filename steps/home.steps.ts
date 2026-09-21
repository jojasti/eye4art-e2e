import { Given, Then } from '../fixtures/fixtures';

Given('I open the home page', async ({ homePage }) => {
  await homePage.goto();
});

Then('the page title contains {string}', async ({ homePage }, text: string) => {
  await homePage.assertTitleContains(text);
});
