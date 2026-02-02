const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  /**
   * Menambahkan lagu ke dalam playlist (tidak duplikat)
   * @param {string} playlistId
   * @param {string} songId
   */
  async addSongToPlaylist(playlistId, songId) {
    // Validasi: pastikan lagu ada
    await this.verifySongExists(songId);

    // Cek duplikasi lagu di playlist
    const checkQuery = {
      text: 'SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const checkResult = await this._pool.query(checkQuery);
    if (checkResult.rowCount > 0) {
      throw new InvariantError('Lagu sudah ada di dalam playlist');
    }

    const id = `playlistsong-${nanoid(16)}`;
    const insertQuery = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const insertResult = await this._pool.query(insertQuery);
    if (!insertResult.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  /**
   * Mengambil semua lagu dari playlist
   * @param {string} playlistId
   * @returns {Promise<Array>} Daftar lagu
   */
  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM playlist_songs
        JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * Menghapus lagu dari playlist
   * @param {string} playlistId
   * @param {string} songId
   */
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Lagu tidak ditemukan di playlist');
    }
  }

  /**
   * Memastikan lagu benar-benar ada di database
   * @param {string} songId
   */
  async verifySongExists(songId) {
    await this._songsService.getSongById(songId); // akan melempar NotFoundError jika tidak ditemukan
  }
}

module.exports = PlaylistSongsService;
