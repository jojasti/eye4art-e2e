import { Given, Then } from '../fixtures/fixtures';

Given('I open the about page', async ({ aboutPage }) => {
  await aboutPage.goto();
});

Then('the main heading is shown', async ({ aboutPage }) => {
  await aboutPage.assertHeading('DIZAJNIRANO DA TRAJE, NAPRAVLJENO DA SE VOLI!', 1);
});

Then('the value headings are shown', async ({ aboutPage }) => {
  await aboutPage.verifyValueHeadingsAreShown();
});
