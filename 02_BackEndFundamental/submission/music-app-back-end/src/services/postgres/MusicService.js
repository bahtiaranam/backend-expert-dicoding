const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums, mapDBToModelAllSongs, mapDBToModelSongs } = require('../../utils');

class MusicService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCoverAlbum({ id, coverUrl }) {
    // Check if the album exists
    const queryCheck = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const resultCheck = await this._pool.query(queryCheck);

    if (!resultCheck.rows?.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Update the coverUrl for the album
    const queryUpdate = {
      text: 'UPDATE albums SET "coverUrl" = $2 WHERE id = $1 RETURNING *',
      values: [id, coverUrl],
    };
    const resultUpdate = await this._pool.query(queryUpdate);

    return resultUpdate.rows[0];
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result?.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result?.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result?.rows?.map(mapDBToModelAlbums)[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async likesAlbumById({ albumId, userId }) {
    const id = `likes-${nanoid(16)}`;
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const resultAlbum = await this._pool.query(queryAlbum);
    if (!resultAlbum?.rows?.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const queryIsLikes = {
      text: 'SELECT * FROM list_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const resultIsLikes = await this._pool.query(queryIsLikes);
    if (resultIsLikes.rows?.length) {
      throw new InvariantError('Album sudah dilike');
    }

    const queryIncreas = {
      text: 'UPDATE albums SET "likes" = "likes" + 1 WHERE id = $1 RETURNING *',
      values: [albumId],
    };

    const queryAddListLikes = {
      text: 'INSERT INTO list_likes (id, album_id, user_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const counterLikes = await this._pool.query(queryIncreas);
    await this._pool.query(queryAddListLikes);

    await this._cacheService.delete(`likes:${albumId}`);

    return counterLikes.rows[0];
  }

  async getLikesAlbumById({ albumId }) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      console.log('results getCache ', result);

      const response = {
        data: JSON.parse(result),
        isCache: true,
      };
      return response;
    } catch (error) {
      console.log('albumId ', albumId);

      const query = {
        text: 'SELECT likes FROM albums WHERE id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      console.log('result ', result);

      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result?.rows[0]));

      const response = {
        data: result?.rows[0],
        isCache: false,
      };
      return response;
    }
  }

  async deleteAlbumsLikesById({ albumId }) {
    const queryDecreas = {
      text: 'UPDATE albums SET "likes" = "likes" - 1 WHERE id = $1 RETURNING *',
      values: [albumId],
    };
    const queryDeleteListLikes = {
      text: 'DELETE FROM list_likes WHERE album_id = $1 RETURNING id',
      values: [albumId],
    };
    const result = await this._pool.query(queryDecreas);
    await this._pool.query(queryDeleteListLikes);

    await this._cacheService.delete(`likes:${albumId}`);

    return result?.rows[0];
  }

  // Songs
  async addSong({
    title, year, genre, performer, duration,
  }) {
    const id = `song-${nanoid(16)}`;

    const queryAlbums = {
      text: 'SELECT * FROM albums',
    };
    const resultAlbums = await this._pool.query(queryAlbums);
    const album_id = resultAlbums?.rows[0]?.id;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, album_id],
    };

    const result = await this._pool.query(query);

    if (!result?.rows[0]?.id) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return result?.rows[0]?.id;
  }

  async getSongs() {
    const query = {
      text: 'SELECT * FROM songs',
    };
    const result = await this._pool.query(query);

    return result?.rows?.map(mapDBToModelAllSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result?.rows?.map(mapDBToModelSongs)[0];
  }

  async editSongById(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [
        title,
        year,
        performer,
        genre,
        duration,
        id,
      ],
    };

    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = MusicService;
