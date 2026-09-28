import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { EMAIL_HREF, PHONE_HREF, WHATSAPP_URL } from './constants/generic';
import { TURNTABLE_SHELVES } from './constants/links';

const SUGGESTION_LABEL = 'Naš predlog za tebe';
// The quiz used to ask for a budget and warn when the match went over it. Both are gone.
const OVER_BUDGET_NOTE = /prelazi budžet/i;

const escapeForRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class QuizPage extends BasePage {
  readonly productCards: Locator;
  readonly openQuizButton: Locator;
  readonly backButton: Locator;
  readonly closeButton: Locator;
  readonly recommendationLabel: Locator;
  readonly recommendationPrice: Locator;
  readonly viewModelButton: Locator;
  readonly orderNowButton: Locator;
  readonly retakeQuizButton: Locator;
  readonly orderOptionsHeading: Locator;
  readonly whatsappOrderLink: Locator;
  readonly phoneOrderLink: Locator;
  readonly emailOrderLink: Locator;
  private recommendedModel?: string;

  constructor(page: Page) {
    super(page);
    this.productCards = page.getByTestId('product-card');
    this.openQuizButton = page.getByRole('button', { name: /uradi quiz/i });
    this.backButton = page.getByRole('button', { name: '← Nazad', exact: true });
    this.closeButton = page.getByRole('button', { name: 'Zatvori', exact: true });
    // The modal carries no test id and no dialog role, so the result screen is recognised
    // by its own label, and the price is read from the block that label sits in.
    this.recommendationLabel = page.getByText(SUGGESTION_LABEL, { exact: true });
    this.recommendationPrice = this.recommendationLabel.locator('..').getByText(/^\d+€$/);
    this.viewModelButton = page.getByRole('button', { name: 'Pogledaj model →', exact: true });
    this.orderNowButton = page.getByRole('button', { name: 'PORUČI odmah', exact: true });
    this.retakeQuizButton = page.getByRole('button', { name: 'Ponovi quiz', exact: true });
    this.orderOptionsHeading = page.getByRole('heading', {
      name: 'Kako želite da naručite?',
      exact: true,
    });
    this.whatsappOrderLink = page.getByRole('link', { name: 'WhatsApp poruka', exact: true });
    this.phoneOrderLink = page.getByRole('link', { name: 'Pozovi nas', exact: true });
    this.emailOrderLink = page.getByRole('link', { name: 'Pošalji email', exact: true });
  }

  async goto() {
    await this.open(TURNTABLE_SHELVES);
  }

  async openQuizOnTurntableShelves() {
    await this.goto();
    await this.openQuizButton.click();
  }

  async openQuizAgain() {
    await this.openQuizButton.click();
  }

  async answer(answerText: string) {
    await this.page.getByRole('button', { name: answerText, exact: true }).click();
  }

  async goBackToThePreviousQuestion() {
    await this.backButton.click();
  }

  async closeQuiz() {
    await this.closeButton.click();
  }

  async retakeQuiz() {
    await this.retakeQuizButton.click();
  }

  async openRecommendedModel() {
    await this.viewModelButton.click();
  }

  async openOrderOptions() {
    await this.orderNowButton.click();
  }

  async verifyQuestion(questionNumber: number, questionCount: number, question: string) {
    await expect(
      this.page.getByText(`Pitanje ${questionNumber} od ${questionCount}`),
    ).toBeVisible();
    await expect(
      this.page.getByRole('heading', { level: 3, name: question, exact: true }),
    ).toBeVisible();
  }

  async verifyAnswersAreOffered(firstAnswer: string, secondAnswer: string, thirdAnswer: string) {
    for (const answerText of [firstAnswer, secondAnswer, thirdAnswer]) {
      await expect(this.page.getByRole('button', { name: answerText, exact: true })).toBeVisible();
    }
  }

  async verifyThereIsNoBackButton() {
    // Anchored on the close button so this cannot pass before the modal has mounted.
    await expect(this.closeButton).toBeVisible();
    await expect(this.backButton).toHaveCount(0);
  }

  async verifyQuizIsClosed() {
    await expect(this.openQuizButton).toBeVisible();
    await expect(this.closeButton).toHaveCount(0);
  }

  async verifyRecommendedModelIs(model: string) {
    this.recommendedModel = model;
    await expect(this.recommendationLabel).toBeVisible();
    await expect(this.recommendationHeadingFor(model)).toBeVisible();
  }

  async verifyRecommendedModelIsNot(model: string) {
    await expect(this.recommendationLabel).toBeVisible();
    await expect(this.recommendationHeadingFor(model)).toHaveCount(0);
  }

  async verifyRecommendationShowsAPrice() {
    await expect(this.recommendationPrice).toBeVisible();
  }

  async verifyThereIsNoOverBudgetNote() {
    await expect(this.recommendationLabel).toBeVisible();
    await expect(this.page.getByText(OVER_BUDGET_NOTE)).toHaveCount(0);
  }

  async verifyRecommendedModelCardIsInView() {
    await expect(this.cardForRecommendedModel()).toBeInViewport();
  }

  async verifyRecommendedModelCanBeOrdered() {
    const orderButton = this.cardForRecommendedModel().getByRole('button', { name: /^poruči$/i });
    await expect(orderButton).toBeEnabled();
  }

  async verifyOrderOptionsAreOfferedForTheRecommendedModel() {
    const model = this.requireRecommendedModel();
    const modelInUrl = escapeForRegExp(encodeURIComponent(model));
    await expect(this.orderOptionsHeading).toBeVisible();
    await expect(this.page.getByText(model, { exact: true })).toBeVisible();
    await expect(this.whatsappOrderLink).toHaveAttribute(
      'href',
      new RegExp(`^${escapeForRegExp(WHATSAPP_URL)}\\?text=.*${modelInUrl}`),
    );
    await expect(this.phoneOrderLink).toHaveAttribute('href', PHONE_HREF);
    await expect(this.emailOrderLink).toHaveAttribute(
      'href',
      new RegExp(`^${escapeForRegExp(EMAIL_HREF)}\\?subject=.*${modelInUrl}`),
    );
  }

  private recommendationHeadingFor(model: string) {
    // The result heading is the bare model name; the product card heading below it reads
    // "Model: <name> - ...", so an exact name matches the recommendation only.
    return this.page.getByRole('heading', { level: 3, name: model, exact: true });
  }

  private cardForRecommendedModel() {
    const model = this.requireRecommendedModel();
    const modelHeading = this.page.getByRole('heading', {
      name: new RegExp(`${escapeForRegExp(model)}(\\s+[-–—]|$)`),
    });
    return this.productCards.filter({ has: modelHeading });
  }

  private requireRecommendedModel() {
    if (!this.recommendedModel) {
      throw new Error('No recommendation yet. Call verifyRecommendedModelIs first.');
    }
    return this.recommendedModel;
  }
}
