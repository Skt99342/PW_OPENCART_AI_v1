import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly headingReturningCustomer: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('#content').getByRole('button', { name: 'Login' });
        this.headingReturningCustomer = page.getByRole('heading', { name: 'Returning Customer' });
        this.alertWarning = page.locator('.alert-danger');
    }

    /**
     * Verifies the login page exists
     * @returns Promise<boolean> - true if the Returning Customer section is displayed
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.headingReturningCustomer.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the warning message shown after a failed login
     * @returns Promise<string> - Warning message text
     */
    async getWarningMessage(): Promise<string> {
        await this.alertWarning.waitFor({ state: 'visible' });
        return (await this.alertWarning.innerText()).trim();
    }

    /**
     * Logs in with the given credentials
     * @param email - Customer email address
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - Instance of the my account page
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        try {
            await this.txtEmail.fill(email);
            await this.txtPassword.fill(password);
            await this.btnLogin.click();
            return new MyAccountPage(this.page);
        } catch (error) {
            console.log(`Error during login: ${error}`);
            throw error;
        }
    }
}
