const { songSchema } = require('../validators/songs/schema');
const InvariantError = require('../exceptions/InvariantError');

const SongValidator = {
  validateSongPayload: (payload) => {
    const { error } = songSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message); // ambil pesan kustom
    }
  },
};

module.exports = SongValidator;
