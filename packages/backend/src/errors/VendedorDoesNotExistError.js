export class VendedorDoesNotExistError extends Error {
  constructor(id) {
    super(`Vendedor con id: ${id} no existe.`);
    this.name = 'VendedorDoesNotExistError';

    this.id = id;

    this.statusCode = 404;
    this.status = 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}