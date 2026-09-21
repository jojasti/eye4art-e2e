import { BasePage } from './BasePage';
import { HOME } from './constants/links';

export class HomePage extends BasePage {
  async goto() {
    await this.open(HOME);
  }
}
