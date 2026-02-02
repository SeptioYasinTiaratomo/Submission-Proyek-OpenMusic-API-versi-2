const { albumSchema } = require('../validators/albums/schema');
const InvariantError = require('../exceptions/InvariantError');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = albumSchema.validate(payload);
    if (error) {
      // Ambil pesan kustom dari detail pertama Joi error
      throw new InvariantError(error.details[0].message);
    }
  },
};

module.exports = AlbumValidator;
