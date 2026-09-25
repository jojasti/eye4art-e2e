import { Given, Then } from '../fixtures/fixtures';

Given('I open a contact page', async ({ contactPage }) => {
  await contactPage.goto();
});

Then('Contact page is opened', async ({ contactPage }) => {
  await contactPage.verifyPageIsOpened();
  await contactPage.verifyContactForm();
  await contactPage.verifyContactInfo();
  await contactPage.allReviews();
});
