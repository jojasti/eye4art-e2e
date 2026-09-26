import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { EMAIL_HREF, FACEBOOK_URL, INSTAGRAM_URL, PHONE_HREF } from './constants/generic';
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
    await expect(this.phoneLink).toHaveAttribute('href', PHONE_HREF);
    await expect(this.emailLink).toHaveAttribute('href', EMAIL_HREF);
    await expect(this.instagramLink).toHaveAttribute('href', INSTAGRAM_URL);
    await expect(this.facebookLink).toHaveAttribute('href', FACEBOOK_URL);
  }

  async verifyProductLinkIsCorrect(productCategory: string) {
    const link = this.footer.locator(`a[href="${PRODUCTS}/${productCategory}"]`);
    await expect(link).toBeVisible();
  }

  async verifyWhatsappLinkIsCorrect() {
    await expect(this.whatsappLink).toHaveAttribute('href', /^https:\/\/wa\.me\/381655107517/);
  }
}
