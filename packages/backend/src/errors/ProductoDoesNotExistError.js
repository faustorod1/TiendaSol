export class ProductoDoesNotExistError extends Error {
  constructor(id) {
    super(`Producto con id: ${id} no existe.`);
    this.name = 'ProductoDoesNotExistError';

    this.id = id;

    this.statusCode = 404;
    this.status = 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}