const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();

    this.getPlaylist = this.getPlaylist.bind(this);
  }

  async getPlaylist(playlistId) {
    try {
      const queryPlaylist = {
        text: 'SELECT playlists.name FROM playlists WHERE playlists.id = $1',
        values: [playlistId],
      };
  
      const querySongs = {
        text: `SELECT songs.* 
        FROM songs 
        JOIN playlist_songs ON songs.id = playlist_songs.song_id 
        JOIN playlists ON playlists.id = playlist_songs.playlist_id
        JOIN users ON users.id = playlists.owner
        WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId],
      };

      const resultPlaylist = await this._pool.query(queryPlaylist);
      const result = await this._pool.query(querySongs);
      const songs = result.rows?.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));

      return {
        playlist: {
          id: playlistId,
          name: resultPlaylist?.rows[0]?.name || '' ,
          songs: songs,
        }
      };
    } catch (error) {
      console.log('error here ', error);
      
    }
  }
}

module.exports = PlaylistsService;
