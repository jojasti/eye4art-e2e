import { When, Then } from '../fixtures/fixtures';

When('I request the page {string}', async ({ httpClient }, path: string) => {
  await httpClient.requestPage(path);
});

Then('the response status is {int}', async ({ httpClient }, expectedStatus: number) => {
  await httpClient.verifyStatus(expectedStatus);
});

Then('the response text contains {string}', async ({ httpClient }, expectedText: string) => {
  await httpClient.verifyTextContains(expectedText);
});
