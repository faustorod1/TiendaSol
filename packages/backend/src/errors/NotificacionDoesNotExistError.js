export class NotificacionDoesNotExistError extends Error {
  constructor(usuarioId, notificacionId) {
    super(`Notificación con id: ${notificacionId} del usuario con id ${usuarioId} no existe.`);
    this.name = 'NotificacionDoesNotExistError';

    this.id = notificacionId;

    this.statusCode = 404;
    this.status = 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
  
}