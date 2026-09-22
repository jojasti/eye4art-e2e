import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS } from './constants/links';

export class FooterPage extends BasePage {
  readonly footer: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly instagramLink: Locator;
  readonly facebookLink: Locator;
  readonly whatsappLink: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.locator('footer');
    this.phoneLink = this.footer.getByRole('link', { name: '+381 65 510 7517' });
    this.emailLink = this.footer.getByRole('link', { name: 'nemanja.kopanlija@gmail.com' });
    this.instagramLink = this.footer.getByRole('link', { name: 'Instagram', exact: true });
    this.facebookLink = this.footer.getByRole('link', { name: 'Facebook', exact: true });
    this.whatsappLink = page.getByRole('link', { name: 'Kontaktirajte nas na WhatsApp' });
  }

  async verifyContactLinksAreCorrect() {
    await expect(this.phoneLink).toHaveAttribute('href', 'tel:+381655107517');
    await expect(this.emailLink).toHaveAttribute('href', 'mailto:nemanja.kopanlija@gmail.com');
    await expect(this.instagramLink).toHaveAttribute(
      'href',
      'https://instagram.com/eye4art_studio',
    );
    await expect(this.facebookLink).toHaveAttribute(
      'href',
      'https://www.facebook.com/profile.php?id=61588624504665',
    );
  }

  async verifyProductLinkIsCorrect(productCategory: string) {
    const link = this.footer.locator(`a[href="${PRODUCTS}/${productCategory}"]`);
    await expect(link).toBeVisible();
  }

  async verifyWhatsappLinkIsCorrect() {
    await expect(this.whatsappLink).toHaveAttribute('href', /^https:\/\/wa\.me\/381655107517/);
  }
}
