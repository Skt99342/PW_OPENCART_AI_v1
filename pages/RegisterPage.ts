import { Page, Locator } from '@playwright/test';
import { RegistrationSuccessPage } from './RegistrationSuccessPage';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly headingRegister: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.getByRole('textbox', { name: 'First Name' });
        this.txtLastName = page.getByRole('textbox', { name: 'Last Name' });
        this.txtEmail = page.getByRole('textbox', { name: 'E-Mail' });
        // Telephone and Password Confirm exist only in some OpenCart versions
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.getByRole('button', { name: 'Continue' });
        this.headingRegister = page.getByRole('heading', { name: 'Register Account' });
    }

    /**
     * Registers a new customer
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email address
     * @param password - Customer password
     * @param telephone - Customer telephone (filled only when the form has the field)
     * @returns Promise<RegistrationSuccessPage> - Instance of the registration success page
     */
    async completeRegistration(firstName: string, lastName: string, email: string, password: string, telephone: string = ''): Promise<RegistrationSuccessPage> {
        try {
            await this.txtFirstName.fill(firstName);
            await this.txtLastName.fill(lastName);
            await this.txtEmail.fill(email);
            if (await this.txtTelephone.count() > 0) {
                await this.txtTelephone.fill(telephone);
            }
            await this.txtPassword.fill(password);
            if (await this.txtConfirmPassword.count() > 0) {
                await this.txtConfirmPassword.fill(password);
            }
            await this.chkPrivacyPolicy.check();
            await this.btnContinue.click();
            return new RegistrationSuccessPage(this.page);
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the register page exists
     * @returns Promise<boolean> - true if the Register Account heading is displayed
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            await this.headingRegister.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking register page: ${error}`);
            return false;
        }
    }
}
