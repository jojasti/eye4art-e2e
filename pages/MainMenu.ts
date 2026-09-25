import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainMenu extends BasePage {
  readonly nav: Locator;
  readonly header: Locator;
  readonly menuToggleButton: Locator;
  readonly englishButton: Locator;
  readonly serbianButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = page.getByRole('navigation');
    this.header = page.getByRole('banner');
    this.menuToggleButton = this.nav.getByRole('button', { name: 'Toggle menu' });
    this.englishButton = this.nav.getByRole('button', { name: 'English', exact: true });
    this.serbianButton = this.nav.getByRole('button', { name: 'Srpski', exact: true });
  }

  // On mobile the menu links are hidden until the hamburger button is clicked.
  // On desktop that button does not exist and the links are always visible.
  private async ensureMenuIsOpen() {
    await expect(this.header).toBeVisible();
    if (!(await this.menuToggleButton.isVisible())) return;

    const blogLink = this.header.getByRole('link', { name: 'Blog', exact: true });
    if (!(await blogLink.isVisible())) {
      await this.menuToggleButton.click();
      await expect(blogLink).toBeVisible();
    }
  }

  async openMenuItem(item: string) {
    await this.ensureMenuIsOpen();
    await this.header.getByRole('link', { name: item, exact: true }).click();
  }

  async switchToEnglish() {
    await this.englishButton.click();
  }

  async switchToSerbian() {
    await this.serbianButton.click();
  }

  async verifyMenuLabelsAreEnglish() {
    await this.ensureMenuIsOpen();
    for (const label of ['Home', 'About Us', 'Products', 'Blog', 'Contact']) {
      await expect(this.header.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  }

  async verifyMenuLabelsAreSerbian() {
    await this.ensureMenuIsOpen();
    for (const label of ['Početna', 'O nama', 'Proizvodi', 'Blog', 'Kontakt']) {
      await expect(this.header.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  }
}
