import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS } from './constants/links';

export class CategoryPage extends BasePage {
  readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.products = page.getByTestId('product-card');
  }

  async goto(slug: string) {
    await this.open(`${PRODUCTS}/${slug}`);
  }

  async verifyProductsAreDisplayed() {
    await expect(this.products.first()).toBeVisible();
  }
}
