import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CONTACT } from './constants/links';

export class ContactPage extends BasePage {
  // Naslovi
  readonly headingPage: Locator;
  readonly contactInfo: Locator;
  readonly customerReviews: Locator;

  // Contact forma
  readonly nameLabel: Locator;
  readonly emailLabel: Locator;
  readonly phoneLabel: Locator;
  readonly messageLabel: Locator;
  readonly sendMessageButton: Locator;

  // Kontakt informacije
  readonly contactInformationTitle: Locator;
  readonly instagramLink: Locator;
  readonly facebookLink: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly location: Locator;

  // sve rezenzije
  readonly allReviewsTitle: Locator;

  constructor(page: Page) {
    super(page);

    // Naslovi
    this.headingPage = page.getByRole('heading', {
      name: 'KONTAKTIRAJTE NAS',
      exact: true,
    });

    this.contactInfo = page.getByRole('heading', {
      name: 'KONTAKT INFORMACIJE',
      exact: true,
    });

    this.customerReviews = page.getByRole('heading', {
      name: 'Utisci naših kupaca',
      exact: true,
    });

    // Contact forma
    this.nameLabel = page.getByText('VAŠE IME', {
      exact: true,
    });

    this.emailLabel = page.getByText('VAŠ EMAIL', {
      exact: true,
    });

    this.phoneLabel = page.getByText('Telefon', {
      exact: true,
    });

    this.messageLabel = page.getByText('VAŠA PORUKA', {
      exact: true,
    });

    this.sendMessageButton = page.getByRole('button', {
      name: 'POŠALJI PORUKU',
      exact: true,
    });

    // Kontakt informacije
    this.contactInformationTitle = page.getByRole('heading', {
      name: 'KONTAKT INFORMACIJE',
      exact: true,
    });

    this.instagramLink = page.getByRole('link', {
      name: '@eye4art_studio',
      exact: true,
    });

    this.facebookLink = page.getByRole('link', {
      name: 'Eye4Art Studio',
      exact: true,
    });

    // Kontakt sekcija
    const contactSection = this.contactInformationTitle.locator('..');

    this.phoneLink = contactSection.getByRole('link', {
      name: '+381 65 510 7517',
      exact: true,
    });

    this.emailLink = contactSection.getByRole('link', {
      name: 'nemanja.kopanlija@gmail.com',
      exact: true,
    });

    this.location = contactSection.getByText('Beograd, Srbija', {
      exact: true,
    });

    this.allReviewsTitle = page.getByText('Pogledajte sve recenzije i ostavite svoju', {
      exact: false,
    });
  }

  async goto() {
    await this.open(CONTACT);
  }

  async verifyPageIsOpened() {
    await expect(this.headingPage).toBeVisible();
    await expect(this.headingPage).toHaveText('KONTAKTIRAJTE NAS');

    await expect(this.contactInfo).toBeVisible();
    await expect(this.contactInfo).toHaveText('KONTAKT INFORMACIJE');

    await expect(this.customerReviews).toBeVisible();
    await expect(this.customerReviews).toHaveText('Utisci naših kupaca');
  }

  async verifyContactForm() {
    await expect(this.nameLabel).toBeVisible();
    await expect(this.nameLabel).toHaveText('VAŠE IME');

    await expect(this.emailLabel).toBeVisible();
    await expect(this.emailLabel).toHaveText('VAŠ EMAIL');

    await expect(this.phoneLabel).toBeVisible();
    await expect(this.phoneLabel).toHaveText('Telefon');

    await expect(this.messageLabel).toBeVisible();
    await expect(this.messageLabel).toHaveText('VAŠA PORUKA');

    await expect(this.sendMessageButton).toBeVisible();
    await expect(this.sendMessageButton).toHaveText('POŠALJI PORUKU');
  }

  async verifyContactInfo() {
    await expect(this.contactInformationTitle).toBeVisible();
    await expect(this.contactInformationTitle).toHaveText('KONTAKT INFORMACIJE');

    await expect(this.instagramLink).toBeVisible();
    await expect(this.instagramLink).toHaveText('@eye4art_studio');

    await expect(this.facebookLink).toBeVisible();
    await expect(this.facebookLink).toHaveText('Eye4Art Studio');

    await expect(this.phoneLink).toBeVisible();
    await expect(this.phoneLink).toHaveText('+381 65 510 7517');

    await expect(this.emailLink).toBeVisible();
    await expect(this.emailLink).toHaveText('nemanja.kopanlija@gmail.com');

    await expect(this.location).toBeVisible();
    await expect(this.location).toHaveText('Beograd, Srbija');
  }

  async allReviews() {
    await this.allReviewsTitle.scrollIntoViewIfNeeded();
    await expect(this.allReviewsTitle).toBeVisible();
    await expect(this.allReviewsTitle).toHaveText('Pogledajte sve recenzije i ostavite svoju');
  }
}
