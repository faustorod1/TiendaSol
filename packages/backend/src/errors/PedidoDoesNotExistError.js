export class PedidoDoesNotExistError extends Error {
  constructor(id) {
    super();
    this.message = "Pedido con id: " + id + " no existe.";
  }
}