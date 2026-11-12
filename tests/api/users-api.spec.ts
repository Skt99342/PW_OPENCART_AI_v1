import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'Status should be 200').toBe(200);

        const users = await response.json();

        expect(Array.isArray(users), 'Response should be an array').toBeTruthy();
        expect(users.length, 'User list should not be empty').toBeGreaterThan(0);
    });

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const user = await response.json();

        expect(user.id, 'Returned id should match the requested id').toBe(USER_ID);
    });

    test('GET - Users with Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const users = await response.json();

        expect(Array.isArray(users), 'Response should be an array').toBeTruthy();
        expect(users.length, `Should return exactly ${LIMIT} users`).toBe(LIMIT);
    });

    test('GET - Sort Users Ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((user: { id: number }) => user.id);

        expect(ids.length, 'Should return users').toBeGreaterThan(0);
        expect(ids, 'User ids should be in ascending order').toEqual([...ids].sort((a, b) => a - b));
    });

    test('GET - Sort Users Descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const ids: number[] = (await response.json()).map((user: { id: number }) => user.id);

        expect(ids.length, 'Should return users').toBeGreaterThan(0);
        expect(ids, 'User ids should be in descending order').toEqual([...ids].sort((a, b) => b - a));
    });

    // ---------------------------------------------------------
    // POST / PUT / DELETE
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'Status should be 201').toBe(201);

        const created = await response.json();

        // FakeStore returns only the generated id for a new user
        expect(typeof created.id, 'A numeric user id should be returned').toBe('number');
        expect(created.id, 'The user id should be greater than 0').toBeGreaterThan(0);
    });

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();
        const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Status should be 200').toBe(200);

        const updated = await response.json();

        expect(updated.username, 'username should be updated').toBe(payload.username);
        expect(updated.username, 'username should start with updated-').toMatch(/^updated-/);
        expect(updated.email, 'email should be updated').toBe(payload.email);
        expect(updated.name, 'name should be updated').toEqual(payload.name);
        expect(updated.phone, 'phone should be updated').toBe(payload.phone);
    });

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Status should be 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'The deleted user id should be returned').toBe(USER_ID);
    });
});
