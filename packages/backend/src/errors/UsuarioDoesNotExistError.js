export class UsuarioDoesNotExistError extends Error {
  constructor(id) {
    super(`Usuario con id: ${id} no existe.`);
    this.name = 'UsuarioDoesNotExistError';

    this.id = id;

    this.statusCode = 404;
    this.status = 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
  
}