const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username
        FROM playlists p
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        JOIN users u ON p.owner = u.id
        WHERE p.owner = $1 OR c.user_id = $1
        GROUP BY p.id, p.name, u.username
      `,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  // --- FITUR LAGU DALAM PLAYLIST ---

  async addSongToPlaylist(playlistId, songId) {
    // PENTING: Cek keberadaan lagu agar tidak 404 saat testing
    const querySong = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const resultSong = await this._pool.query(querySong);

    if (!resultSong.rowCount) {
      throw new NotFoundError('Gagal menambahkan lagu. Id lagu tidak ditemukan');
    }

    const id = `ps-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM songs s
      JOIN playlist_songs ps ON ps.song_id = s.id
      WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist. Id lagu tidak ditemukan');
    }
  }

  // --- FITUR ACTIVITIES (OPSIONAL) ---

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
    throw new InvariantError('Aktivitas gagal dicatat');
    }
  }

 async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
      FROM playlist_song_activities psa
      JOIN users u ON u.id = psa.user_id
      JOIN songs s ON s.id = psa.song_id
      WHERE psa.playlist_id = $1
      ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // --- VERIFIKASI ---
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error; // Melempar AuthorizationError dari verifyPlaylistOwner
      }
    }
  }

  async getPlaylistByIdWithSongs(playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists p
      JOIN users u ON u.id = p.owner
      WHERE p.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songs = await this.getSongsFromPlaylist(playlistId);

    return {
      ...result.rows[0],
      songs,
    };
  }
}

module.exports = PlaylistsService;