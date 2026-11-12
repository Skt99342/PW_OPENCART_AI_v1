import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class RegistrationSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountCreated: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingAccountCreated = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.lnkContinue = page.locator('#content').getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the account was created
     * @returns Promise<boolean> - true if the success heading is displayed
     */
    async isAccountCreated(): Promise<boolean> {
        try {
            await this.headingAccountCreated.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking registration success: ${error}`);
            return false;
        }
    }

    /**
     * Gets the confirmation message shown under the heading
     * @returns Promise<string> - Confirmation message text
     */
    async getConfirmationMessage(): Promise<string> {
        return (await this.page.locator('#content p').first().innerText()).trim();
    }

    /**
     * Clicks the Continue button
     * @returns Promise<MyAccountPage> - Instance of the my account page
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.lnkContinue.click();
        return new MyAccountPage(this.page);
    }
}
