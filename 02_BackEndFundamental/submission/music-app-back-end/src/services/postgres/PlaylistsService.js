/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
// const nodemailer = require('nodemailer');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAllPlaylists } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async verifyPlaylistOwner({ playlistId, userId }) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addPlaylist({ name, owner }) {
    try {
      const id = `playlist-${nanoid(16)}`;

      const query = {
        text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner],
      };

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Playlist gagal ditambahkan');
      }

      return result.rows[0].id;
    } catch (error) {
      console.log('error add ', error);
      throw new InvariantError('Playlist gagal ditambahkan');
    }
  }

  async addSongToPlaylist({ playlistId, songId, userId }) {
    await this.verifyPlaylistOwner({ playlistId, userId });

    const queryCheckSong = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const resultChecking = await this._pool.query(queryCheckSong);

    if (!resultChecking.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongByPlaylistId({ playlistId, userId }) {
    await this.verifyPlaylistOwner({ playlistId, userId });

    const queryOwner = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

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

    const resultOwner = await this._pool.query(queryOwner);
    const resultPlaylist = await this._pool.query(queryPlaylist);
    const result = await this._pool.query(querySongs);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Gagal memuat lagu, Playlist tidak ditemukan');
    }

    const songs = result.rows?.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    return {
      id: playlistId,
      name: resultPlaylist.rows[0].name,
      username: resultOwner.rows[0].username,
      songs: songs || [],
    };
  }

  async getAllPlaylists(owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelAllPlaylists);
  }

  async deletePlaylistById({ playlistId, userId }) {
    await this.verifyPlaylistOwner({ playlistId, userId });

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteSongPlaylistById({ playlistId, songId, userId }) {
    await this.verifyPlaylistOwner({ playlistId, userId });
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }

  async verifyNoteAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
