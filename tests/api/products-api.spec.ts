import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Product list should not be empty').toBeGreaterThan(0);

        for (const product of products) {
            expect(typeof product.id, 'id should be a number').toBe('number');
            expect(typeof product.title, 'title should be a string').toBe('string');
            expect(typeof product.price, 'price should be a number').toBe('number');
            expect(typeof product.category, 'category should be a string').toBe('string');
            expect(typeof product.image, 'image should be a string').toBe('string');
        }
    });

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const product = await response.json();

        expect(product.id, 'Returned id should match the requested id').toBe(PRODUCT_ID);
        expect(product.title.length, 'title should not be empty').toBeGreaterThan(0);
        expect(product.price, 'price should be greater than 0').toBeGreaterThan(0);
        expect(product.category.length, 'category should not be empty').toBeGreaterThan(0);
        expect(product.image, 'image should be a URL').toContain('http');
    });

    test('GET - Products with Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, `Should return exactly ${LIMIT} products`).toBe(LIMIT);
    });

    test('GET - Sort Products Ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((product: { id: number }) => product.id);

        expect(ids.length, 'Should return products').toBeGreaterThan(0);
        expect(ids, 'Product ids should be in ascending order').toEqual([...ids].sort((a, b) => a - b));
    });

    test('GET - Sort Products Descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((product: { id: number }) => product.id);

        expect(ids.length, 'Should return products').toBeGreaterThan(0);
        expect(ids, 'Product ids should be in descending order').toEqual([...ids].sort((a, b) => b - a));
    });

    test('GET - All Product Categories @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories), 'Response should be an array').toBeTruthy();
        expect(categories.length, 'Category list should not be empty').toBeGreaterThan(0);
        expect(categories, `Categories should include ${CATEGORY}`).toContain(CATEGORY);
    });

    test('GET - Products by Category @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Category should have products').toBeGreaterThan(0);

        for (const product of products) {
            expect(product.category, `Product ${product.id} should belong to ${CATEGORY}`).toBe(CATEGORY);
        }
    });

    // ---------------------------------------------------------
    // POST / PUT / DELETE
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Status should be 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'A product id should be returned').toBeTruthy();
        expect(created.title, 'title should match the submitted value').toBe(payload.title);
        expect(created.price, 'price should match the submitted value').toBe(payload.price);
        expect(created.description, 'description should match the submitted value').toBe(payload.description);
        expect(created.image, 'image should match the submitted value').toBe(payload.image);
        expect(created.category, 'category should match the submitted value').toBe(payload.category);
    });

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Status should be 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned id should match the requested id').toBe(PRODUCT_ID);
        expect(updated.title, 'title should be updated').toBe(payload.title);
        expect(updated.title, 'title should start with Updated').toMatch(/^Updated /);
        expect(updated.price, 'price should be updated').toBe(payload.price);
        expect(updated.category, 'category should be updated').toBe(payload.category);
    });

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'The deleted product id should be returned').toBe(PRODUCT_ID);
    });
});
