import { test, expect } from '@playwright/test';

test.describe('SWAPI - Planets API', () => {

  test('GET /planets/1 - debe responder 200', async ({ request }) => {
    const response = await request.get('/planets/1/');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(data);
  });

  test('GET /planets/1 - debe devolver el planeta Tatooine', async ({ request }) => {
    const response = await request.get('/planets/1/');
    const data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.result.properties.name).toBe('Tatooine');
    expect(data.result.uid).toBe('1');
  });

});