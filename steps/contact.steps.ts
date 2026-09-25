import { Given, Then } from '../fixtures/fixtures';

Given('I open a contact page', async ({ contactPage }) => {
  await contactPage.goto();
});

Then('Contact page is opened', async ({ contactPage }) => {
  await contactPage.verifyPageIsOpened();
});

Then('Contact form is shown', async ({ contactPage }) => {
  await contactPage.verifyContactForm();
});

Then('Contact info is shown', async ({ contactPage }) => {
  await contactPage.verifyContactInfo();
});

Then('Contact links have the right href', async ({ contactPage }) => {
  await contactPage.verifyContactLinksHaveCorrectHref();
});

Then('All reviews link is shown', async ({ contactPage }) => {
  await contactPage.verifyAllReviewsLink();
});
