const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../exceptions/ServerError');
const { PlaylistsPayloadSchema, PlaylistsSongSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      const { message, details } = validationResult.error;
      if (details[0].type.includes('required') || details[0].type.includes('base')) {
        throw new ClientError(message);
      }
      ServerError();
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistsSongSchema.validate(payload);
    if (validationResult.error) {
      const { message, details } = validationResult.error;
      if (details[0].type.includes('required') || details[0].type.includes('base')) {
        throw new ClientError(message);
      }
      ServerError();
    }
  },
};

module.exports = PlaylistsValidator;
