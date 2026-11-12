/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @sanity @regression @web @e2e @end-to-end
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the product, quantity, price and cart total
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping flow test @master @sanity @regression @web @e2e @end-to-end', async ({ page, homePage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `${Date.now()}_${RandomDataUtil.getEmail()}`;
    const password = RandomDataUtil.getPassword();
    const telephone = RandomDataUtil.getPhoneNumber();
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    const registerPage = await test.step('2) Register a new customer', async () => {
        await homePage.clickMyAccount();
        return await homePage.clickRegister();
    });

    const registrationSuccessPage = await test.step('2a) Submit the registration form', async () => {
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
        return await registerPage.completeRegistration(firstName, lastName, email, password, telephone);
    });

    await test.step('3) Verify successful registration', async () => {
        expect(await registrationSuccessPage.isAccountCreated()).toBeTruthy();
    });

    await test.step('4) Log out', async () => {
        const myAccountPage = await registrationSuccessPage.clickContinue();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        const logoutPage = await homePage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('5) Log in with the newly created credentials', async () => {
        await homePage.clickMyAccount();
        const loginPage = await homePage.clickLogin();
        const myAccountPage = await loginPage.login(email, password);

        await test.step('6) Verify successful authentication', async () => {
            expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        });
    });

    const productPage = await test.step('7) Search for a known product and open its details page', async () => {
        const searchResultsPage = await homePage.searchProduct(productName);
        expect(await searchResultsPage.isProductExists(productName)).toBeTruthy();
        return await searchResultsPage.clickProduct(productName);
    });

    await test.step('8) Verify the product details page', async () => {
        expect(await productPage.getProductName()).toBe(productName);
        expect(await productPage.getProductPrice()).toBe(totalPrice);
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.clickAddToCart();
        expect(await productPage.isAddedToCartMessageDisplayed(productName)).toBeTruthy();
    });

    const shoppingCartPage = await test.step('10) Open the shopping cart', async () => {
        return await homePage.clickShoppingCart();
    });

    await test.step('11) Verify the product, quantity, price and cart total', async () => {
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.getCartItemCount()).toBe(1);
        expect(await shoppingCartPage.getProductName()).toBe(productName);
        expect(await shoppingCartPage.getQuantity()).toBe(productQuantity);
        expect(await shoppingCartPage.getUnitPrice()).toBe(totalPrice);
        expect(Helper.convertPriceToNumber(await shoppingCartPage.getCartTotal())).toBe(
            Helper.convertPriceToNumber(totalPrice) * Number(productQuantity)
        );
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});
