import { test, expect } from '@playwright/test';
import { peopleSchema } from '../../src/api/schemas/people.schema';
import{ Ajv } from 'ajv';

const ajv = new Ajv();
const validatePeopleSchema = ajv.compile(peopleSchema);
 
test.describe('SWAPI - people API', () => {
 
  const people = [
    { id: 4, name: 'Darth Vader' },
    { id: 5, name: 'Leia Organa' },
    { id: 6, name: 'Owen Lars' },
  ];
 
  for (const person of people) {
    test(`GET /people/${person.id} - debe responder 200`, async ({ request }) => {
      const response = await request.get(`people/${person.id}/`);
 
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
 
    test(`GET /people/${person.id} - debe devolver la persona "${person.name}"`, async ({ request }) => {
      const response = await request.get(`people/${person.id}/`);
      const data = await response.json();
 
      expect(response.status()).toBe(200);
      expect(data.result.properties.name).toBe(person.name);
      expect(data.result.uid).toBe(String(person.id));
    });
 
    test(`GET /people/${person.id} - debe cumplir con el schema esperado`, async ({ request }) => {
      const response = await request.get(`people/${person.id}/`);
      const data = await response.json();

      const valid = validatePeopleSchema(data);
 
      expect(valid).toBeTruthy();
    });
  }
 
});
 