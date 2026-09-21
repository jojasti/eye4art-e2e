import { When, Then } from '../fixtures/fixtures';

When('I open {string} from the main menu', async ({ mainMenu }, item: string) => {
  await mainMenu.open(item);
});

When('I open the {string} category', async ({ productsPage }, name: string) => {
  await productsPage.openCategory(name);
});

Then('I see the category heading {string}', async ({ categoryPage }, text: string) => {
  await categoryPage.assertHeading(text);
});

Then('I see at least one product', async ({ categoryPage }) => {
  await categoryPage.verifyHasProducts();
});
