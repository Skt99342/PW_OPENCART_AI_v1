import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    // ---------------------------------------------------------
    // Schema Validation
    // ---------------------------------------------------------

    test('Schema - Product Response @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = new Ajv().compile(schema);
        const isValid = validate(await response.json());

        expect(isValid, `Product schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    test('Schema - User Response @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = new Ajv().compile(schema);
        const isValid = validate(await response.json());

        expect(isValid, `User schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    test('Schema - Cart Response @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = new Ajv().compile(schema);
        const isValid = validate(await response.json());

        expect(isValid, `Cart schema errors: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });
});
