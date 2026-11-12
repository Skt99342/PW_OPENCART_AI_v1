/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Verify the login page is displayed
 * 4) Enter valid credentials and submit the login form
 * 5) Verify successful authentication and redirect to My Account
 * 6) Verify the authenticated account navigation is visible
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login test @master @sanity @regression @web', async ({ page, homePage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    const loginPage = await test.step('2) Navigate to My Account -> Login', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickLogin();
    });

    await test.step('3) Verify the login page is displayed', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    const myAccountPage = await test.step('4) Log in with valid credentials', async () => {
        return await loginPage.login(email, password);
    });

    await test.step('5) Verify successful authentication and redirect to My Account', async () => {
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        await expect(page).toHaveURL(/route=account\/account/);
    });

    await test.step('6) Verify the authenticated account navigation is visible', async () => {
        expect(await myAccountPage.isAccountNavigationVisible()).toBeTruthy();
        await homePage.clickMyAccount();
        expect(await homePage.getMyAccountMenuOptions()).toContain('Logout');
    });

    console.log('✅ ✔️ Valid login completed successfully!');
});
