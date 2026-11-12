import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProductName: Locator;
    private readonly lblProductPrice: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProductName = page.locator('#content h1');
        this.lblProductPrice = page.locator('#content ul.list-unstyled li h2');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
    }

    /**
     * Gets the product name shown on the product page
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        return (await this.headingProductName.innerText()).trim();
    }

    /**
     * Gets the product price shown on the product page
     * @returns Promise<string> - Product price, e.g. $602.00
     */
    async getProductPrice(): Promise<string> {
        return (await this.lblProductPrice.innerText()).trim();
    }

    /**
     * Sets the quantity to add to the cart
     * @param quantity - Quantity to enter
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Verifies the product was added to the cart
     * @param productName - Product name expected in the success message
     * @returns Promise<boolean> - true if the success message is displayed
     */
    async isAddedToCartMessageDisplayed(productName: string): Promise<boolean> {
        try {
            await this.alertSuccess.waitFor({ state: 'visible' });
            const message = await this.alertSuccess.innerText();
            return message.includes(`You have added ${productName} to your shopping cart`);
        } catch (error) {
            console.log(`Error checking add to cart message: ${error}`);
            return false;
        }
    }
}
