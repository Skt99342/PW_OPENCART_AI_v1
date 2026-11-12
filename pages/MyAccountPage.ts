import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingMyAccount = page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
    }

    /**
     * Verifies the account navigation (right column) is visible
     * @returns Promise<boolean> - true if the Edit Account and Logout links are displayed
     */
    async isAccountNavigationVisible(): Promise<boolean> {
        try {
            const navigation = this.page.locator('#column-right');
            await navigation.getByRole('link', { name: 'Edit Account' }).waitFor({ state: 'visible' });
            return await navigation.getByRole('link', { name: 'Logout' }).isVisible();
        } catch (error) {
            console.log(`Error checking account navigation: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the my account page exists
     * @returns Promise<boolean> - true if the My Account heading is displayed
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.headingMyAccount.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking my account page: ${error}`);
            return false;
        }
    }
}
