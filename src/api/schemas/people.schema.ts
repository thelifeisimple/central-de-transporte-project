export const peopleSchema = {
    type: 'object',
    properties: {
      message: { type: 'string' },
      result: {
        type: 'object',
        properties: {
          properties: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              height: { type: 'string' },
              mass: { type: 'string' },
              hair_color: { type: 'string' },
              skin_color: { type: 'string' },
              eye_color: { type: 'string' },
              birth_year: { type: 'string' },
              gender: { type: 'string' },
              homeworld: { type: 'string' },
              films: { type: 'array', items: { type: 'string' } },
              species: { type: 'array', items: { type: 'string' } },
              vehicles: { type: 'array', items: { type: 'string' } },
              starships: { type: 'array', items: { type: 'string' } },
              created: { type: 'string' },
              edited: { type: 'string' },
              url: { type: 'string' },
            },
            required: ['name', 'height', 'mass', 'gender', 'url'],
            additionalProperties: true,
          },
          _id: { type: 'string' },
          description: { type: 'string' },
          uid: { type: 'string' },
        },
        required: ['properties', 'uid'],
        additionalProperties: true,
      },
    },
    required: ['result'],
    additionalProperties: true,
  };
   