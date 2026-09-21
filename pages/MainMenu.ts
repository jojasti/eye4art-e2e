import { BasePage } from './BasePage';

export class MainMenu extends BasePage {
  async openMenuItem(item: string) {
    await this.page.getByRole('navigation').getByRole('link', { name: item, exact: true }).click();
  }
}
