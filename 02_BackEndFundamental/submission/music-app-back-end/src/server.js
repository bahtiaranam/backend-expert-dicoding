/* eslint-disable max-len */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const musics = require('./api/musics');
const MusicsService = require('./services/postgres/MusicService');
const MusicsValidator = require('./validator/musics');
const ClientError = require('./exceptions/ClientError');
const InvariantError = require('./exceptions/InvariantError');
const NotFoundError = require('./exceptions/NotFoundError');
const ServerError = require('./exceptions/ServerError');
 
const init = async () => {
  const musicsService = new MusicsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: musics,
    options: {
      service: musicsService,
      validator: MusicsValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (
      response instanceof ClientError
    || response instanceof NotFoundError
    || response instanceof InvariantError
    || response instanceof ServerError
    ) {
      const newResponse = h.response({
        status: !(response instanceof ServerError) ? 'fail' : 'error',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
