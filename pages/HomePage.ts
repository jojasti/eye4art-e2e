import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HOME, PRODUCTS, TURNTABLE_SHELVES } from './constants/links';

export class HomePage extends BasePage {
  readonly exploreProductsLink: Locator;
  readonly viewAllTurntableModelsLink: Locator;
  readonly productsGrid: Locator;
  readonly reviewsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.exploreProductsLink = page.getByRole('link', { name: 'Istraži proizvode' });
    this.viewAllTurntableModelsLink = page.getByRole('link', { name: 'Pogledaj sve modele' });
    this.productsGrid = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: 'NAŠI PROIZVODI' }) });
    this.reviewsSection = page.locator('section').filter({ hasText: 'Google Recenzije' });
  }

  async goto() {
    await this.open(HOME);
  }

  async openExploreProducts() {
    await this.exploreProductsLink.click();
  }

  async verifyOnProductsPage() {
    await this.assertUrl(PRODUCTS);
  }

  async openViewAllTurntableModels() {
    await this.viewAllTurntableModelsLink.click();
  }

  async verifyOnTurntableShelvesPage() {
    await this.assertUrl(TURNTABLE_SHELVES);
  }

  private categoryGridLink(categoryName: string) {
    return this.productsGrid.getByRole('link').filter({
      has: this.page.getByRole('heading', { name: categoryName, level: 3 }),
    });
  }

  async openCategoryFromGrid(categoryName: string) {
    await this.categoryGridLink(categoryName).click();
  }

  async verifyOnCategoryPage(productCategory: string) {
    await this.assertUrl(`${PRODUCTS}/${productCategory}`);
  }

  async verifyReviewsRatingIsShown() {
    await expect(this.reviewsSection.getByText('5.0', { exact: true })).toBeVisible();
  }

  async verifyReviewsHaveTextAndAuthor() {
    const quote = this.reviewsSection.locator('p').filter({ hasText: /^"/ }).first();
    const author = this.reviewsSection.locator('p').filter({ hasText: /^—/ }).first();
    await expect(quote).toBeVisible();
    await expect(author).toBeVisible();
  }
}
