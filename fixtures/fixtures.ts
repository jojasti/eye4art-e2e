import { test as base, createBdd } from 'playwright-bdd';
import { MainMenu } from '../pages/MainMenu';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CategoryPage } from '../pages/CategoryPage';

type Fixtures = {
  mainMenu: MainMenu;
  homePage: HomePage;
  productsPage: ProductsPage;
  categoryPage: CategoryPage;
};

export const test = base.extend<Fixtures>({
  mainMenu: async ({ page }, use) => {
    await use(new MainMenu(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
});

export const { Given, When, Then } = createBdd(test);
