import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.products = page.getByRole('heading', { level: 3, name: /^model/i });
  }

  async goto(path: string) {
    await this.open(path);
  }

  async verifyHasProducts() {
    await expect(this.products.first()).toBeVisible();
  }
}
