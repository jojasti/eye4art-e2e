import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ABOUT } from './constants/links';

export class AboutPage extends BasePage {
  async goto() {
    await this.open(ABOUT);
  }

  async verifyValueHeadingsAreShown() {
    for (const value of ['AUTENTIČNOST', 'DUGOVEČNOST', 'PO MERI']) {
      await expect(
        this.page.getByRole('heading', { level: 3, name: value, exact: true }),
      ).toBeVisible();
    }
  }
}
