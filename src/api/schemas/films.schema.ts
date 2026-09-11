export const filmSchema = {
    type: 'object',
    properties: {
      message: { type: 'string' },
      result: {
        type: 'object',
        properties: {
          properties: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              episode_id: { type: 'number' },
              opening_crawl: { type: 'string' },
              director: { type: 'string' },
              producer: { type: 'string' },
              release_date: { type: 'string' },
              characters: { type: 'array', items: { type: 'string' } },
              planets: { type: 'array', items: { type: 'string' } },
              starships: { type: 'array', items: { type: 'string' } },
              vehicles: { type: 'array', items: { type: 'string' } },
              species: { type: 'array', items: { type: 'string' } },
              created: { type: 'string' },
              edited: { type: 'string' },
              url: { type: 'string' },
            },
            required: ['title', 'episode_id', 'director', 'release_date', 'url'],
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