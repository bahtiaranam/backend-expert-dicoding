const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../exceptions/ServerError');
const { AlbumPayloadSchema, SongPayloadSchema } = require('./schema');

const MusicsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      const { message, details } = validationResult.error;
      if (details[0].type.includes('required') || details[0].type.includes('base')) {
        throw new ClientError(message);
      }

      throw new ServerError();
    }
  },

  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      const { message, details } = validationResult.error;
      if (details[0].type.includes('required') || details[0].type.includes('base')) {
        throw new ClientError(message);
      }

      throw new ServerError();
    }
  },

  validateCoverAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      const { message, details } = validationResult.error;
      if (details[0].type.includes('required') || details[0].type.includes('base')) {
        throw new ClientError(message);
      }

      throw new ServerError();
    }
  },
};

module.exports = MusicsValidator;
