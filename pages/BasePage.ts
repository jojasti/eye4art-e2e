import { expect, type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async assertTitleContains(text: string) {
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page).toHaveTitle(new RegExp(escaped));
  }

  async assertHeading(text: string, level = 1) {
    await expect(this.page.getByRole('heading', { level, name: text, exact: true })).toBeVisible();
  }

  async assertUrl(path: string) {
    await expect(this.page).toHaveURL(path);
  }
}
