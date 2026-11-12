/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Register
 * 3) Verify the registration page is displayed
 * 4) Register with a unique customer email and accept the Privacy Policy
 * 5) Verify the registration succeeds and the confirmation is displayed
 * 6) Verify the new account is available through the account navigation
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration test @master @sanity @regression @web', async ({ page, homePage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `${Date.now()}_${RandomDataUtil.getEmail()}`;
    const password = RandomDataUtil.getPassword();
    const telephone = RandomDataUtil.getPhoneNumber();

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    const registerPage = await test.step('2) Navigate to My Account -> Register', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickRegister();
    });

    await test.step('3) Verify the registration page is displayed', async () => {
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
    });

    const registrationSuccessPage = await test.step('4) Submit the registration form', async () => {
        return await registerPage.completeRegistration(firstName, lastName, email, password, telephone);
    });

    await test.step('5) Verify the registration succeeds', async () => {
        expect(await registrationSuccessPage.isAccountCreated()).toBeTruthy();
        expect(await registrationSuccessPage.getConfirmationMessage()).toContain('successfully created');
    });

    await test.step('6) Verify the account is available through the account navigation', async () => {
        await homePage.clickMyAccount();
        const menuOptions = await homePage.getMyAccountMenuOptions();
        expect(menuOptions).toContain('Logout');
        expect(menuOptions).not.toContain('Register');
        expect(menuOptions).not.toContain('Login');

        const myAccountPage = await registrationSuccessPage.clickContinue();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    console.log('✅ ✔️ User registration completed successfully!');
});
