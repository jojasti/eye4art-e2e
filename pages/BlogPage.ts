import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { BLOG } from './constants/links';

export class BlogPage extends BasePage {
  readonly posts: Locator;
  readonly backToBlogLink: Locator;
  private selectedPostHeading?: string;

  constructor(page: Page) {
    super(page);
    this.posts = page.getByRole('article');
    this.backToBlogLink = page.getByRole('link', { name: 'Nazad na blog' });
  }

  async goto() {
    await this.open(BLOG);
  }

  async verifyPostsAreListed() {
    const firstPost = this.posts.first();
    await expect(firstPost).toBeVisible();
    await expect(firstPost.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(firstPost.getByRole('link', { name: /Čitaj više/ })).toBeVisible();
  }

  async openFirstPost() {
    const firstPost = this.posts.first();
    const heading = await firstPost.getByRole('heading', { level: 2 }).textContent();
    if (!heading) {
      throw new Error('First post has no heading text.');
    }
    this.selectedPostHeading = heading.trim();
    await firstPost.getByRole('link', { name: /Čitaj više/ }).click();
  }

  async verifyPostHeadingMatchesSelected() {
    if (!this.selectedPostHeading) {
      throw new Error('No post selected. Call openFirstPost first.');
    }
    await expect(
      this.page.getByRole('heading', { level: 1, name: this.selectedPostHeading, exact: true }),
    ).toBeVisible();
  }

  async verifyBackToBlogLinkIsShown() {
    await expect(this.backToBlogLink).toBeVisible();
  }
}
