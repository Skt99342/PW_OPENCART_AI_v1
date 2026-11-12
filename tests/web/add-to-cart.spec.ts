/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Search for a known product and open its details page
 * 3) Verify the product details are displayed
 * 4) Set the quantity and click Add to Cart
 * 5) Verify the product-added success message
 * 6) Open the shopping cart
 * 7) Verify the product is present with the requested quantity
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @sanity @regression @web', async ({ page, homePage }) => {
    const { productName, totalPrice } = Helper.getProductDetails();
    const quantity = '2';

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    const productPage = await test.step('2) Search for a known product and open its details page', async () => {
        const searchResultsPage = await homePage.searchProduct(productName);
        return await searchResultsPage.clickProduct(productName);
    });

    await test.step('3) Verify the product details are displayed', async () => {
        expect(await productPage.getProductName()).toBe(productName);
        expect(await productPage.getProductPrice()).toBe(totalPrice);
    });

    await test.step('4) Set the quantity and add the product to the cart', async () => {
        await productPage.setQuantity(quantity);
        await productPage.clickAddToCart();
    });

    await test.step('5) Verify the product-added success message', async () => {
        expect(await productPage.isAddedToCartMessageDisplayed(productName)).toBeTruthy();
    });

    const shoppingCartPage = await test.step('6) Open the shopping cart', async () => {
        return await homePage.clickShoppingCart();
    });

    await test.step('7) Verify the product is present with the requested quantity', async () => {
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.getCartItemCount()).toBe(1);
        expect(await shoppingCartPage.getProductName()).toBe(productName);
        expect(await shoppingCartPage.getQuantity()).toBe(quantity);
    });

    console.log('✅ ✔️ Product added to cart successfully!');
});
