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

Then('the footer shows the {string} heading', async ({ footerPage }, footerHeading: string) => {
  await footerPage.verifyFooterHeadingIsVisible(footerHeading);
});

Then(
  'the footer quick link {string} goes to {string}',
  async ({ footerPage }, linkName: string, pageLink: string) => {
    await footerPage.verifyQuickLinkGoesToPage(linkName, pageLink);
  },
);

Then('the footer shows the static text {string}', async ({ footerPage }, footerText: string) => {
  await footerPage.verifyStaticTextIsVisible(footerText);
});
