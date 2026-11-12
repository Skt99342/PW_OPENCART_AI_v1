import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { RegistrationSuccessPage } from '../pages/RegistrationSuccessPage';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL as string;

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    registrationSuccessPage: RegistrationSuccessPage;
    loginPage: LoginPage;
    logoutPage: LogoutPage;
    myAccountPage: MyAccountPage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    shoppingCartPage: ShoppingCartPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    registrationSuccessPage: async ({ page }, use) => {
        await use(new RegistrationSuccessPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    shoppingCartPage: async ({ page }, use) => {
        await use(new ShoppingCartPage(page));
    },
});

test.afterEach(async ({ page, context }) => {
    if (!page.isClosed()) {
        await page.close();
    }
    await context.close().catch(() => {});
});

export { expect } from '@playwright/test';
