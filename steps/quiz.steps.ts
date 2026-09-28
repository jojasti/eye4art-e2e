import { Given, Then, When } from '../fixtures/fixtures';

Given('I open the quiz on the turntable shelves page', async ({ quizPage }) => {
  await quizPage.openQuizOnTurntableShelves();
});

When('I answer {string}', async ({ quizPage }, answerText: string) => {
  await quizPage.answer(answerText);
});

When('I go back to the previous question', async ({ quizPage }) => {
  await quizPage.goBackToThePreviousQuestion();
});

When('I close the quiz', async ({ quizPage }) => {
  await quizPage.closeQuiz();
});

When('I open the quiz again', async ({ quizPage }) => {
  await quizPage.openQuizAgain();
});

When('I retake the quiz', async ({ quizPage }) => {
  await quizPage.retakeQuiz();
});

When('I open the recommended model', async ({ quizPage }) => {
  await quizPage.openRecommendedModel();
});

When('I open the order options', async ({ quizPage }) => {
  await quizPage.openOrderOptions();
});

Then(
  'question {int} of {int} asks {string}',
  async ({ quizPage }, questionNumber: number, questionCount: number, question: string) => {
    await quizPage.verifyQuestion(questionNumber, questionCount, question);
  },
);

Then(
  'the answers are {string}, {string} and {string}',
  async ({ quizPage }, firstAnswer: string, secondAnswer: string, thirdAnswer: string) => {
    await quizPage.verifyAnswersAreOffered(firstAnswer, secondAnswer, thirdAnswer);
  },
);

Then('there is no back button', async ({ quizPage }) => {
  await quizPage.verifyThereIsNoBackButton();
});

Then('the quiz is closed', async ({ quizPage }) => {
  await quizPage.verifyQuizIsClosed();
});

Then('the recommended model is {string}', async ({ quizPage }, model: string) => {
  await quizPage.verifyRecommendedModelIs(model);
});

Then('the recommended model is not {string}', async ({ quizPage }, model: string) => {
  await quizPage.verifyRecommendedModelIsNot(model);
});

Then('the recommendation shows a price', async ({ quizPage }) => {
  await quizPage.verifyRecommendationShowsAPrice();
});

Then('there is no over-budget note', async ({ quizPage }) => {
  await quizPage.verifyThereIsNoOverBudgetNote();
});

Then('the recommended model card is in view', async ({ quizPage }) => {
  await quizPage.verifyRecommendedModelCardIsInView();
});

Then('the recommended model can be ordered', async ({ quizPage }) => {
  await quizPage.verifyRecommendedModelCanBeOrdered();
});

Then(
  'the order options offer WhatsApp, a phone call and email for the recommended model',
  async ({ quizPage }) => {
    await quizPage.verifyOrderOptionsAreOfferedForTheRecommendedModel();
  },
);
