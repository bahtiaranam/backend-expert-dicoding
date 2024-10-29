/* eslint-disable max-len */
class ExportsHandler {
  constructor(service, validator, rabbitmq) {
    this._service = service;
    this._validator = validator;
    this._rabbitmq = rabbitmq;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    await this._service.verifyPlaylistOwner({ playlistId: request.params.id, userId: request.auth.credentials.id });

    const message = {
      playlistId: request.params.id,
      targetEmail: request.payload.targetEmail,
    };

    console.log('message ', message);
    await this._rabbitmq.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
