import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingLogout: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingLogout = page.getByRole('heading', { name: 'Account Logout' });
        this.lnkContinue = page.locator('#content').getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the logout page exists
     * @returns Promise<boolean> - true if the Account Logout heading is displayed
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.headingLogout.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.lnkContinue.click();
        return new HomePage(this.page);
    }
}
