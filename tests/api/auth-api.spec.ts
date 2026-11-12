import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

// override: true because Windows already defines a USERNAME variable (the OS user)
dotenv.config({ override: true });

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.USERNAME as string;
    const PASSWORD = process.env.PASSWORD as string;

    // ---------------------------------------------------------
    // POST - Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD },
        });

        expect(response.status(), 'Valid credentials should return 201').toBe(201);

        const body = await response.json();

        expect(body.token, 'Response should contain a token').toBeDefined();
        expect(typeof body.token, 'Token should be a string').toBe('string');
        expect(body.token.length, 'Token should not be empty').toBeGreaterThan(0);
    });

    test('POST - Invalid Login @master @regression @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: RandomDataUtil.generateInvalidLoginPayload(),
        });

        expect(response.status(), 'Invalid credentials should return 401').toBe(401);

        const message = await response.text();

        expect(message, 'Error message should match').toBe('username or password is incorrect');
    });
});
