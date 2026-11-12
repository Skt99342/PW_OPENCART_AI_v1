import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly headingShoppingCart: Locator;
    private readonly cartRows: Locator;
    private readonly lblCartTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingShoppingCart = page.getByRole('heading', { name: /Shopping Cart/ });
        // Selectors cover both the older and newer OpenCart cart layouts
        this.cartRows = page.locator('#content table:has(input[name^="quantity"]) tbody tr');
        this.lblCartTotal = page.locator('#checkout-total tr:last-child td:last-child, #content .col-sm-4 table tr:last-child td:last-child');
    }

    /**
     * Verifies the shopping cart page exists
     * @returns Promise<boolean> - true if the Shopping Cart heading is displayed
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            await this.headingShoppingCart.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the number of product rows in the cart
     * @returns Promise<number> - Number of products in the cart
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartRows.count();
    }

    /**
     * Gets the product name of the given cart row
     * @param row - Zero-based row index
     * @returns Promise<string> - Product name
     */
    async getProductName(row: number = 0): Promise<string> {
        return (await this.cartRows.nth(row).locator('td.text-start a, td.text-left a').first().innerText()).trim();
    }

    /**
     * Gets the quantity of the given cart row
     * @param row - Zero-based row index
     * @returns Promise<string> - Quantity
     */
    async getQuantity(row: number = 0): Promise<string> {
        return await this.cartRows.nth(row).locator('input[name^="quantity"]').inputValue();
    }

    /**
     * Gets the unit price of the given cart row
     * @param row - Zero-based row index
     * @returns Promise<string> - Unit price, e.g. $602.00
     */
    async getUnitPrice(row: number = 0): Promise<string> {
        return (await this.cartRows.nth(row).locator('td.text-end, td.text-right').first().innerText()).trim();
    }

    /**
     * Gets the cart total
     * @returns Promise<string> - Cart total, e.g. $602.00
     */
    async getCartTotal(): Promise<string> {
        return (await this.lblCartTotal.innerText()).trim();
    }
}
