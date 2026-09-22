import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SeoPage extends BasePage {
  async goto(path: string) {
    await this.open(path);
  }

  async verifyCanonicalLinkIsCorrect() {
    const canonical = this.page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute('href', /^https:\/\/www\.eye4artstudio\.com/);
  }

  async verifyMetaDescriptionIsCorrect() {
    const description = this.page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  }
}
