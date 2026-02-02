const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    // 1. Verifikasi bahwa yang request adalah OWNER playlist
    // (Hanya owner yang boleh nambah kolaborator)
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    // 2. Tambahkan kolaborasi
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    // 1. Verifikasi owner
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    // 2. Hapus kolaborasi
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;