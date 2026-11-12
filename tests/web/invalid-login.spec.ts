/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Enter an invalid email and password and submit the form
 * 4) Verify authentication fails with the expected warning
 * 5) Verify the customer is not authenticated
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid login test @master @regression @web', async ({ page, homePage }) => {
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword();

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    const loginPage = await test.step('2) Navigate to My Account -> Login', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickLogin();
    });

    await test.step('3) Submit invalid credentials', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        await loginPage.login(email, password);
    });

    await test.step('4) Verify authentication fails with the expected warning', async () => {
        expect(await loginPage.getWarningMessage()).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('5) Verify the customer is not authenticated', async () => {
        await expect(page).toHaveURL(/route=account\/login/);
        await homePage.clickMyAccount();
        const menuOptions = await homePage.getMyAccountMenuOptions();
        expect(menuOptions).toContain('Login');
        expect(menuOptions).not.toContain('Logout');
    });

    console.log('✅ ✔️ Invalid login rejected as expected!');
});
