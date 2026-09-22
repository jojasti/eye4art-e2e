import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainMenu extends BasePage {
  readonly nav: Locator;
  readonly englishButton: Locator;
  readonly serbianButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = page.getByRole('navigation');
    this.englishButton = this.nav.getByRole('button', { name: 'English', exact: true });
    this.serbianButton = this.nav.getByRole('button', { name: 'Srpski', exact: true });
  }

  async openMenuItem(item: string) {
    await this.nav.getByRole('link', { name: item, exact: true }).click();
  }

  async switchToEnglish() {
    await this.englishButton.click();
  }

  async switchToSerbian() {
    await this.serbianButton.click();
  }

  async verifyMenuLabelsAreEnglish() {
    for (const label of ['Home', 'About Us', 'Products', 'Blog', 'Contact']) {
      await expect(this.nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  }

  async verifyMenuLabelsAreSerbian() {
    for (const label of ['Početna', 'O nama', 'Proizvodi', 'Blog', 'Kontakt']) {
      await expect(this.nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  }
}
