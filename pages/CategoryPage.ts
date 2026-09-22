import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS } from './constants/links';

const ALLOWED_STOCK_STATUS = /✓ Na stanju|Izrada \d+-\d+ radnih dana|NIJE NA STANJU/;

export class CategoryPage extends BasePage {
  readonly products: Locator;
  readonly backToProductsLink: Locator;
  readonly quizButton: Locator;
  readonly quizModalCloseButton: Locator;
  private selectedProduct?: Locator;

  constructor(page: Page) {
    super(page);
    this.products = page.getByTestId('product-card');
    this.backToProductsLink = page.getByRole('link', { name: 'Nazad na proizvode' });
    this.quizButton = page.getByRole('button', { name: /uradi quiz/i });
    this.quizModalCloseButton = page.getByRole('button', { name: 'Zatvori', exact: true });
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

  async verifyOrderButtonIsDisabled(buttonText: string) {
    if (!this.selectedProduct) {
      throw new Error('No product selected. Call findProductByModel first.');
    }
    const orderButton = this.selectedProduct.getByRole('button', { name: buttonText, exact: true });
    await expect(orderButton).toBeDisabled();
  }

  async verifyEveryProductShowsAllowedStockStatus() {
    await expect(this.products.first()).toBeVisible();
    const cards = await this.products.all();
    for (const card of cards) {
      await expect(card.getByText(ALLOWED_STOCK_STATUS)).toBeVisible();
    }
  }

  async goBackToProducts() {
    await this.backToProductsLink.click();
  }

  async verifyOnProductsPage() {
    await this.assertUrl(PRODUCTS);
  }

  async openQuiz() {
    await this.quizButton.click();
  }

  async verifyQuizModalIsOpen() {
    await expect(this.page.getByText('Pitanje 1 od 5')).toBeVisible();
  }

  async closeQuiz() {
    await this.quizModalCloseButton.click();
  }

  async verifyQuizModalIsClosed() {
    await expect(this.quizModalCloseButton).toBeHidden();
  }

  async verifyMaterialsAreShown() {
    if (!this.selectedProduct) {
      throw new Error('No product selected. Call findProductByModel first.');
    }
    await expect(this.selectedProduct.getByText(/^Materijali:/)).toBeVisible();
  }

  async verifyDimensionsAreShown() {
    if (!this.selectedProduct) {
      throw new Error('No product selected. Call findProductByModel first.');
    }
    await expect(this.selectedProduct.getByText(/^Dimenzije:/)).toBeVisible();
  }

  async verifyPriceIsShown() {
    if (!this.selectedProduct) {
      throw new Error('No product selected. Call findProductByModel first.');
    }
    await expect(this.selectedProduct.getByText(/€/)).toBeVisible();
  }
}
