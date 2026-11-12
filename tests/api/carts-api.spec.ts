import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Cart list should not be empty').toBeGreaterThan(0);
    });

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const cart = await response.json();

        expect(cart.id, 'Returned id should match the requested id').toBe(CART_ID);
    });

    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Date range should return carts').toBeGreaterThan(0);

        for (const cart of carts) {
            const cartDate = new Date(cart.date);
            expect(cartDate >= new Date(START_DATE), `Cart ${cart.id} date ${cart.date} should be on/after ${START_DATE}`).toBeTruthy();
            expect(cartDate <= new Date(END_DATE), `Cart ${cart.id} date ${cart.date} should be on/before ${END_DATE}`).toBeTruthy();
        }
    });

    test('GET - User Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'The user should have carts').toBeGreaterThan(0);

        for (const cart of carts) {
            expect(cart.userId, `Cart ${cart.id} should belong to user ${USER_ID}`).toBe(USER_ID);
        }
    });

    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, `Should return exactly ${LIMIT} carts`).toBe(LIMIT);
    });

    test('GET - Sort Carts Ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((cart: { id: number }) => cart.id);

        expect(ids.length, 'Should return carts').toBeGreaterThan(0);
        expect(ids, 'Cart ids should be in ascending order').toEqual([...ids].sort((a, b) => a - b));
    });

    test('GET - Sort Carts Descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((cart: { id: number }) => cart.id);

        expect(ids.length, 'Should return carts').toBeGreaterThan(0);
        expect(ids, 'Cart ids should be in descending order').toEqual([...ids].sort((a, b) => b - a));
    });

    // ---------------------------------------------------------
    // POST / PUT / DELETE
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Status should be 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'A cart id should be returned').toBeTruthy();
        expect(created.userId, 'userId should match the submitted value').toBe(payload.userId);
        expect(created.products, 'products should match the submitted value').toEqual(payload.products);
    });

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Status should be 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned id should match the requested id').toBe(CART_ID);
        expect(updated.userId, 'userId should be unchanged').toBe(USER_ID);
        expect(updated.products[0].quantity, 'Product quantity should be updated').toBe(payload.products[0].quantity);
        expect(updated.products, 'products should match the submitted value').toEqual(payload.products);
    });

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'The deleted cart id should be returned').toBe(CART_ID);
    });
});
