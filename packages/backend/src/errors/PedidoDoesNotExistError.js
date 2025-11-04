export class PedidoDoesNotExistError extends Error {
  constructor(id) {
    super(`Pedido con id: ${id} no existe.`);
    this.name = 'PedidoDoesNotExistError';

    this.id = id;

    this.statusCode = 404;
    this.status = 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}