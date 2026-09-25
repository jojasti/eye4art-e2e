import { When, Then } from '../fixtures/fixtures';

When('I open {string} from the main menu', async ({ mainMenu }, item: string) => {
  await mainMenu.openMenuItem(item);
});

Then('I am on the {string} page', async ({ mainMenu }, path: string) => {
  await mainMenu.assertUrl(path);
});

When('I switch the language to English', async ({ mainMenu }) => {
  await mainMenu.switchToEnglish();
});

When('I switch the language to Srpski', async ({ mainMenu }) => {
  await mainMenu.switchToSerbian();
});

Then('the menu labels are in English', async ({ mainMenu }) => {
  await mainMenu.verifyMenuLabelsAreEnglish();
});

Then('the menu labels are in Serbian', async ({ mainMenu }) => {
  await mainMenu.verifyMenuLabelsAreSerbian();
});

Then(
  'the level {int} heading {string} is shown',
  async ({ mainMenu }, headingLevel: number, englishHeading: string) => {
    await mainMenu.assertHeading(englishHeading, headingLevel);
  },
);
