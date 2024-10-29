const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const CoverAlbumPayloadSchema = Joi.object({
  cover: Joi.any().custom((value, helpers) => {
    if (!value || !value.mimetype.startsWith('image/')) {
      return helpers.message('Invalid file type. Only image files are allowed.');
    }
    return value;
  }).required(),
});

const SongPayloadSchema = Joi.object({
  title: Joi.string(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { AlbumPayloadSchema, CoverAlbumPayloadSchema, SongPayloadSchema };
