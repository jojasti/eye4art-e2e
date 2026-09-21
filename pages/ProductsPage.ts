import { BasePage } from './BasePage';
import { PRODUCTS } from './constants/links';

export class ProductsPage extends BasePage {
  async goto() {
    await this.open(PRODUCTS);
  }

  async openCategory(name: string) {
    await this.page.getByRole('link', { name }).click();
  }
}
