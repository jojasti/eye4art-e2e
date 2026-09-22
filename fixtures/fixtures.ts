import { test as base, createBdd } from 'playwright-bdd';
import { ANALYTICS_URL_PATTERN } from '../pages/constants/generic';
import { MainMenu } from '../pages/MainMenu';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CategoryPage } from '../pages/CategoryPage';
import { FooterPage } from '../pages/FooterPage';
import { SeoPage } from '../pages/SeoPage';

type Fixtures = {
  mainMenu: MainMenu;
  homePage: HomePage;
  productsPage: ProductsPage;
  categoryPage: CategoryPage;
  footerPage: FooterPage;
  seoPage: SeoPage;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(ANALYTICS_URL_PATTERN, (route) => route.abort());
    await use(page);
  },
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
  footerPage: async ({ page }, use) => {
    await use(new FooterPage(page));
  },
  seoPage: async ({ page }, use) => {
    await use(new SeoPage(page));
  },
});

export const { Given, When, Then } = createBdd(test);
