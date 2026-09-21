import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS } from './constants/links';

export class ProductsPage extends BasePage {
  async goto() {
    await this.open(PRODUCTS);
  }

  private categoryCard(name: string) {
    return this.page.getByRole('link', { name }).filter({ has: this.page.getByRole('img') });
  }

  async openCategoryByName(name: string) {
    await this.categoryCard(name).click();
  }

  async verifyCategoryIsDisplayed(name: string) {
    await expect(this.categoryCard(name)).toBeVisible();
  }
}
