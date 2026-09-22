import { Then } from '../fixtures/fixtures';

Then('the footer contact links are correct', async ({ footerPage }) => {
  await footerPage.verifyContactLinksAreCorrect();
});

Then(
  'the footer has a link to the {string} category page',
  async ({ footerPage }, productCategory: string) => {
    await footerPage.verifyProductLinkIsCorrect(productCategory);
  },
);

Then('the WhatsApp button link is correct', async ({ footerPage }) => {
  await footerPage.verifyWhatsappLinkIsCorrect();
});
