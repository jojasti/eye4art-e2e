import { Given, Then, When } from '../fixtures/fixtures';

Given('I open the blog page', async ({ blogPage }) => {
  await blogPage.goto();
});

Then('posts are listed', async ({ blogPage }) => {
  await blogPage.verifyPostsAreListed();
});

When('I open the first post', async ({ blogPage }) => {
  await blogPage.openFirstPost();
});

Then('the post heading matches the selected post', async ({ blogPage }) => {
  await blogPage.verifyPostHeadingMatchesSelected();
});

Then('the back to blog link is shown', async ({ blogPage }) => {
  await blogPage.verifyBackToBlogLinkIsShown();
});
