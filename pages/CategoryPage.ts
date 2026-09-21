import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS } from './constants/links';

export class CategoryPage extends BasePage {
  readonly products: Locator;
  private selectedProduct?: Locator;

  constructor(page: Page) {
    super(page);
    this.products = page.getByTestId('product-card');
  }

  async goto(productCategory: string) {
    await this.open(`${PRODUCTS}/${productCategory}`);
  }

  async verifyProductsAreDisplayed() {
    await expect(this.products.first()).toBeVisible();
  }

  async findProductByModel(model: string) {
    const escapedModel = model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const modelHeading = this.page.getByRole('heading', {
      name: new RegExp(`${escapedModel}(\\s+[-–—]|$)`),
    });
    this.selectedProduct = this.products.filter({ has: modelHeading });
    await expect(this.selectedProduct).toBeVisible();
  }

  async verifyOrderButtonIsEnabled() {
    if (!this.selectedProduct) {
      throw new Error('No product selected. Call findProductByModel first.');
    }
    const orderButton = this.selectedProduct.getByRole('button', { name: /^poruči$/i });
    await expect(orderButton).toBeEnabled();
  }
}
