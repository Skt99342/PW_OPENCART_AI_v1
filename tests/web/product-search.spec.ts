/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Enter a known product name in the search field and submit
 * 3) Verify the search results page is displayed
 * 4) Verify the expected product appears in the results
 * 5) Verify every displayed product name matches the search criteria
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search test @master @sanity @regression @web', async ({ page, homePage }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Open the application', async () => {
        await expect(page).toHaveURL(process.env.WEB_APP_URL as string);
    });

    const searchResultsPage = await test.step('2) Search for a known product', async () => {
        return await homePage.searchProduct(productName);
    });

    await test.step('3) Verify the search results page is displayed', async () => {
        expect(await searchResultsPage.isSearchResultsPageExists(productName)).toBeTruthy();
    });

    await test.step('4) Verify the expected product appears in the results', async () => {
        expect(await searchResultsPage.isProductExists(productName)).toBeTruthy();
    });

    await test.step('5) Verify the displayed product names match the search criteria', async () => {
        const names = await searchResultsPage.getProductNames();
        expect(names.length).toBeGreaterThan(0);
        for (const name of names) {
            expect(name.toLowerCase()).toContain(productName.toLowerCase());
        }
    });

    console.log('✅ ✔️ Product search completed successfully!');
});
