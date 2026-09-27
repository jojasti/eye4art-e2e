import type { DataTable } from 'playwright-bdd';
import { Given, Then, When } from '../fixtures/fixtures';

Given('I open the turntable shelves page', async ({ quizPage }) => {
  await quizPage.goto();
});

When('I open the quiz', async ({ quizPage }) => {
  await quizPage.openQuiz();
});

When('I close the quiz', async ({ quizPage }) => {
  await quizPage.closeQuiz();
});

When('I answer {string}', async ({ quizPage }, answer: string) => {
  await quizPage.answerQuestion(answer);
});

When('I go back one question', async ({ quizPage }) => {
  await quizPage.goBackOneQuestion();
});

When('I retake the quiz', async ({ quizPage }) => {
  await quizPage.retakeQuiz();
});

When('I view the recommended model', async ({ quizPage }) => {
  await quizPage.viewRecommendedModel();
});

Then(
  'I see {string} asking {string}',
  async ({ quizPage }, questionCounter: string, questionText: string) => {
    await quizPage.verifyQuestionIsShown(questionCounter, questionText);
  },
);

Then('the quiz answers are:', async ({ quizPage }, answers: DataTable) => {
  await quizPage.verifyAnswersAreShown(answers.raw().flat());
});

Then('the quiz is closed', async ({ quizPage }) => {
  await quizPage.verifyQuizIsClosed();
});

Then(
  'the quiz recommends {string} for {string}',
  async ({ quizPage }, recommendedModel: string, price: string) => {
    await quizPage.verifyRecommendation(recommendedModel, price);
  },
);

Then('the over-budget note is shown', async ({ quizPage }) => {
  await quizPage.verifyOverBudgetNoteIsShown();
});

Then('the over-budget note is not shown', async ({ quizPage }) => {
  await quizPage.verifyOverBudgetNoteIsHidden();
});

Then('the recommended model is at most {int} cm wide', async ({ quizPage }, maxWidthCm: number) => {
  await quizPage.verifyRecommendedModelWidthIsAtMost(maxWidthCm);
});

Then("the recommended model's card is in view", async ({ quizPage }) => {
  await quizPage.verifyRecommendedModelCardIsInView();
});
