import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { filmSchema } from '../../src/api/schemas/films.schema';
 
const ajv = new Ajv();
const validateFilmSchema = ajv.compile(filmSchema);

test.describe('SWAPI - films API', () => {

  const films = [
    { id: 4, title: 'The Phantom Menace' },
    { id: 5, title: 'Attack of the Clones' },
    { id: 6, title: 'Revenge of the Sith' },
  ];

  for (const film of films) {
    test(`GET /films/${film.id} - debe responder 200`, async ({ request }) => {
      const response = await request.get(`films/${film.id}/`);

      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });

    test(`GET /films/${film.id} - debe devolver el titulo "${film.title}"`, async ({ request }) => {
      const response = await request.get(`films/${film.id}/`);
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.result.properties.title).toBe(film.title);
      expect(data.result.uid).toBe(String(film.id));
    });

    test(`GET /films/${film.id} - debe cumplir con el schema esperado`, async ({ request }) => {
      const response = await request.get(`films/${film.id}/`);
      const data = await response.json();

      const valid = validateFilmSchema(data);

      if (!valid) {
        console.log('Errores de validación de schema:', validateFilmSchema.errors);
      }

      expect(valid).toBeTruthy();
    });
  }

});