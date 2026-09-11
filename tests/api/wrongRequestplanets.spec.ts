import { test, expect } from '@playwright/test';

test.describe('SWAPI - Planets API wrong', () => {

  test('GET /planets/1 - debe responder 404', async ({ request }) => {
    const response = await request.get('/planets/wrong/');

    expect(response.status()).toBe(404);

    const data = await response.json();
    console.log(data);
  });


});