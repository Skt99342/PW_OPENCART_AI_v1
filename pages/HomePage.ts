import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';
import { ShoppingCartPage } from './ShoppingCartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkLogout: Locator;
    private readonly lnkShoppingCart: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkMyAccount = page.locator('#top a.dropdown-toggle', { hasText: 'My Account' });
        this.lnkRegister = page.locator('#top .dropdown-menu').getByRole('link', { name: 'Register' });
        this.lnkLogin = page.locator('#top .dropdown-menu').getByRole('link', { name: 'Login' });
        this.lnkLogout = page.locator('#top .dropdown-menu').getByRole('link', { name: 'Logout' });
        this.lnkShoppingCart = page.locator('#top').getByRole('link', { name: 'Shopping Cart' });
        this.txtSearch = page.getByRole('textbox', { name: 'Search' });
        this.btnSearch = page.locator('#search button');
    }

    /**
     * Opens the My Account dropdown in the top menu
     */
    async clickMyAccount(): Promise<void> {
        await this.lnkMyAccount.click();
    }

    /**
     * Gets the options listed in the open My Account dropdown
     * @returns Promise<string[]> - Option names, e.g. Register, Login or Logout
     */
    async getMyAccountMenuOptions(): Promise<string[]> {
        const options = this.page.locator('#top .dropdown-menu a:visible');
        await options.first().waitFor({ state: 'visible' });
        return (await options.allInnerTexts()).map(option => option.trim());
    }

    /**
     * Clicks the Register option of the My Account dropdown
     * @returns Promise<RegisterPage> - Instance of the register page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.lnkRegister.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks the Login option of the My Account dropdown
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.lnkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Clicks the Logout option of the My Account dropdown
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        return new LogoutPage(this.page);
    }

    /**
     * Searches for a product using the search box
     * @param productName - Product name to search for
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
        return new SearchResultsPage(this.page);
    }

    /**
     * Clicks the Shopping Cart link in the top menu
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<ShoppingCartPage> {
        await this.lnkShoppingCart.click();
        return new ShoppingCartPage(this.page);
    }
}
