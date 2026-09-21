import type { Page } from '@playwright/test';

export class MainMenu {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(item: string) {
    await this.page.getByRole('navigation').getByRole('link', { name: item, exact: true }).click();
  }
}
