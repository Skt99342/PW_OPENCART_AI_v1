/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Log in using valid customer credentials
 * 3) Verify authentication succeeds
 * 4) Click Logout from the My Account menu
 * 5) Verify the logout confirmation page is displayed
 * 6) Click Continue and verify the redirect to the homepage
 * 7) Verify authenticated account options are no longer available
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout test @master @sanity @regression @web', async ({ page, homePage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    await test.step('2) Log in and verify authentication succeeds', async () => {
        await homePage.clickMyAccount();
        const loginPage = await homePage.clickLogin();
        const myAccountPage = await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    const logoutPage = await test.step('3) Click Logout', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickLogout();
    });

    await test.step('4) Verify the logout confirmation page is displayed', async () => {
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
    });

    await test.step('5) Click Continue and verify the redirect to the homepage', async () => {
        await logoutPage.clickContinue();
        await expect(page).toHaveURL(/route=common\/home/);
    });

    await test.step('6) Verify authenticated account options are no longer available', async () => {
        await homePage.clickMyAccount();
        const menuOptions = await homePage.getMyAccountMenuOptions();
        expect(menuOptions).toContain('Login');
        expect(menuOptions).toContain('Register');
        expect(menuOptions).not.toContain('Logout');
    });

    console.log('✅ ✔️ Logout completed successfully!');
});
