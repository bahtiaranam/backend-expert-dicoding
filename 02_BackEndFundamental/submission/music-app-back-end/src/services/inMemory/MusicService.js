const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicsService {
  constructor() {
    this._albums = [];
    this._songs = [];
  }

  addAlbum({ name, year }) {
    if (name === undefined || year === undefined) {
      throw new InvariantError('Gagal menambahkan album. Mohon isi nama album');
    }
    const id = `album-${nanoid(16)}`;

    const newAlbum = {
      id, name, year,
    };

    this._albums.push(newAlbum);

    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
    };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
    this._albums.splice(index, 1);
  }

  // songs
  addSong({
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const albumId = `album-${nanoid(16)}`;

    const newSong = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return id;
  }

  getSongs() {
    return this._songs.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));
  }

  getSongById(id) {
    const song = this._songs.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      performer,
      genre,
      duration,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = MusicsService;
