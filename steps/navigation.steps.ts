import { When, Then } from '../fixtures/fixtures';

When('I open {string} from the main menu', async ({ mainMenu }, item: string) => {
  await mainMenu.openMenuItem(item);
});

Then('I am on the {string} page', async ({ mainMenu }, path: string) => {
  await mainMenu.assertUrl(path);
});
