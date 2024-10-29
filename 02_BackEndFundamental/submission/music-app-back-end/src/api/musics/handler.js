const fs = require('fs');
const path = require('path');

class MusicsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addCoverAlbumHandler = this.addCoverAlbumHandler.bind(this);
    this.getLikesAlbum = this.getLikesAlbum.bind(this);
    this.deleteLikesAlbum = this.deleteLikesAlbum.bind(this);
    this.addAlbumHandler = this.addAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.editAlbumByIdHandler = this.editAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.handleLikesAlbum = this.handleLikesAlbum.bind(this);

    this.addSongHandler = this.addSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.editSongByIdHandler = this.editSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async addCoverAlbumHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;

      // menentukan nama dan folder berkas
      const { filename } = cover.hapi;
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = filename.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        const response = h.response({
          status: 'fail',
          message: 'File yang diunggah harus berupa jpg, jpeg, atau png',
        });
        response.code(400);
        return response;
      }
      const directory = path.resolve(__dirname, 'uploads');
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory); // membuat folder bila belum ada
      }

      // membuat writable stream
      const location = `${directory}/${filename}`;
      const fileStream = fs.createWriteStream(location);
      await new Promise((resolve, reject) => {
        // mengembalikan Promise.reject ketika terjadi eror
        fileStream.on('error', (error) => reject(error));

        // membaca Readable (data) dan menulis ke Writable (fileStream)
        cover.pipe(fileStream);

        // setelah selesai membaca Readable (data) maka mengembalikan nama berkas.
        cover.on('end', () => resolve(filename));
      });

      await this._service.addCoverAlbum({ id, coverUrl: filename });

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('Gagal mengunggah sampul');
    }
  }

  async addAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async editAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async getLikesAlbum(request, h) {
    try {
      const { id } = request.params;
      const likes = await this._service.getLikesAlbumById({ albumId: id });

      const response = h.response({
        status: 'success',
        data: likes.data,
      });
      if (likes.isCache) response.header('X-Data-Source', 'cache');
      response.code(200);
      return response;
    } catch (error) {
      console.log('error music', error);
      return error;
    }
  }

  async deleteLikesAlbum(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumsLikesById({ albumId: id });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil di unlike',
    });
    response.code(200);
    return response;
  }

  async handleLikesAlbum(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const likeAlbum = await this._service.likesAlbumById({ albumId: id, userId: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        likeAlbum,
      },
    });
    response.code(201);
    return response;
  }

  // Songs
  async addSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      performer,
      genre,
      duration,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async editSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = MusicsHandler;
