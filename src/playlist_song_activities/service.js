const { Pool } = require('pg');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities(playlistId) {
    const query = {
      text: `
        SELECT users.username, songs.title, activity.action, activity.time
        FROM playlist_song_activities AS activity
        JOIN users ON activity.user_id = users.id
        JOIN songs ON activity.song_id = songs.id
        WHERE activity.playlist_id = $1
        ORDER BY activity.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => ({
      username: row.username,
      title: row.title,
      action: row.action,
      time: row.time,
    }));
  }
}

module.exports = PlaylistSongActivitiesService;
