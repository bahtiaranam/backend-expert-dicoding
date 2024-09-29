class ServerError extends Error {
  constructor() {
    super();
    this.message = 'Maaf, terjadi kegagalan pada server kami.';
    this.statusCode = 500;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
