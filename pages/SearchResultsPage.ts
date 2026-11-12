import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly productList: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productList = page.locator('#content .product-thumb');
    }

    /**
     * Verifies the search results page is displayed for the given search term
     * @param searchTerm - Term that was searched for
     * @returns Promise<boolean> - true if the Search heading is displayed
     */
    async isSearchResultsPageExists(searchTerm: string): Promise<boolean> {
        try {
            await this.page.getByRole('heading', { name: `Search - ${searchTerm}` }).waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the names of all products listed in the results
     * @returns Promise<string[]> - Product names
     */
    async getProductNames(): Promise<string[]> {
        await this.productList.first().waitFor({ state: 'visible' });
        const names = await this.productList.locator('h4 a').allInnerTexts();
        return names.map(name => name.trim());
    }

    /**
     * Verifies a product with the exact name is listed in the results
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if the product is listed
     */
    async isProductExists(productName: string): Promise<boolean> {
        try {
            const product = this.productList.getByRole('link', { name: productName, exact: true }).first();
            await product.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking product in results: ${error}`);
            return false;
        }
    }

    /**
     * Opens the product details page
     * @param productName - Exact product name to open
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async clickProduct(productName: string): Promise<ProductPage> {
        await this.productList.getByRole('link', { name: productName, exact: true }).first().click();
        return new ProductPage(this.page);
    }
}
