import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TURNTABLE_SHELVES } from './constants/links';

// "Dimenzije: 52 × 47 × 73 cm" - the first number is the width
const DIMENSIONS_WITH_WIDTH = /Dimenzije:\s*([\d.]+)\s*×/;

export class QuizPage extends BasePage {
  readonly quizButton: Locator;
  readonly closeButton: Locator;
  readonly quizPanel: Locator;
  readonly backButton: Locator;
  readonly retakeButton: Locator;
  readonly viewModelButton: Locator;
  readonly recommendationLabel: Locator;
  readonly recommendedModelHeading: Locator;
  readonly overBudgetNote: Locator;
  readonly answerButtons: Locator;
  readonly products: Locator;
  private recommendedModel?: string;

  constructor(page: Page) {
    super(page);
    this.quizButton = page.getByRole('button', { name: /uradi quiz/i });
    this.closeButton = page.getByRole('button', { name: 'Zatvori', exact: true });
    // The quiz has no role or test id; its Close button sits directly in the quiz panel
    this.quizPanel = this.closeButton.locator('..');
    this.backButton = this.quizPanel.getByRole('button', { name: '← Nazad', exact: true });
    this.retakeButton = this.quizPanel.getByRole('button', { name: 'Ponovi quiz', exact: true });
    this.viewModelButton = this.quizPanel.getByRole('button', {
      name: 'Pogledaj model →',
      exact: true,
    });
    this.recommendationLabel = this.quizPanel.getByText('Naš predlog za tebe', { exact: true });
    this.recommendedModelHeading = this.quizPanel.getByRole('heading', { level: 3 });
    this.overBudgetNote = this.quizPanel.getByText(/prelazi budžet/);
    this.answerButtons = this.quizPanel
      .getByRole('button')
      .filter({ hasNotText: /^(← Nazad|Zatvori)$/ });
    this.products = page.getByTestId('product-card');
  }

  async goto() {
    await this.open(TURNTABLE_SHELVES);
  }

  async openQuiz() {
    await this.quizButton.click();
  }

  async closeQuiz() {
    await this.closeButton.click();
  }

  async answerQuestion(answer: string) {
    const answerButton = this.quizPanel.getByRole('button', { name: answer, exact: true });
    await answerButton.click();
    // Wait for the quiz to move on, so the next answer is not clicked mid-transition
    await expect(answerButton).toBeHidden();
  }

  async goBackOneQuestion() {
    await this.backButton.click();
  }

  async retakeQuiz() {
    await this.retakeButton.click();
  }

  async viewRecommendedModel() {
    await this.readRecommendedModel();
    await this.viewModelButton.click();
  }

  async verifyQuestionIsShown(questionCounter: string, questionText: string) {
    await expect(this.quizPanel.getByText(questionCounter, { exact: true })).toBeVisible();
    await expect(
      this.quizPanel.getByRole('heading', { level: 3, name: questionText, exact: true }),
    ).toBeVisible();
  }

  async verifyAnswersAreShown(answers: string[]) {
    await expect(this.answerButtons).toHaveText(answers);
  }

  async verifyQuizIsClosed() {
    await expect(this.closeButton).toBeHidden();
  }

  async verifyRecommendation(recommendedModel: string, price: string) {
    await expect(this.recommendationLabel).toBeVisible();
    await expect(this.recommendedModelHeading).toHaveText(recommendedModel);
    await expect(this.quizPanel.getByText(price, { exact: true })).toBeVisible();
  }

  async verifyOverBudgetNoteIsShown() {
    await expect(this.recommendationLabel).toBeVisible();
    await expect(this.overBudgetNote).toBeVisible();
  }

  async verifyOverBudgetNoteIsHidden() {
    await expect(this.recommendationLabel).toBeVisible();
    await expect(this.overBudgetNote).toBeHidden();
  }

  // Width is a hard constraint: reads the model the quiz picked, then its width from its own card
  async verifyRecommendedModelWidthIsAtMost(maxWidthCm: number) {
    const model = await this.readRecommendedModel();
    const dimensions = this.productCardForModel(model).getByText(/^Dimenzije:/);
    await expect(dimensions).toHaveText(DIMENSIONS_WITH_WIDTH);
    const dimensionsText = (await dimensions.textContent()) ?? '';
    const widthCm = Number(dimensionsText.match(DIMENSIONS_WITH_WIDTH)?.[1]);
    expect(widthCm, `"${model}" width in cm`).toBeLessThanOrEqual(maxWidthCm);
  }

  async verifyRecommendedModelCardIsInView() {
    if (!this.recommendedModel) {
      throw new Error('No recommended model read. Call viewRecommendedModel first.');
    }
    await expect(this.productCardForModel(this.recommendedModel)).toBeInViewport();
  }

  private async readRecommendedModel() {
    await expect(this.recommendationLabel).toBeVisible();
    this.recommendedModel = ((await this.recommendedModelHeading.textContent()) ?? '').trim();
    return this.recommendedModel;
  }

  private productCardForModel(model: string) {
    const escapedModel = model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const modelHeading = this.page.getByRole('heading', {
      name: new RegExp(`^Model:\\s*${escapedModel}(\\s+[-–—]|$)`, 'i'),
    });
    return this.products.filter({ has: modelHeading });
  }
}
