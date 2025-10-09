export class ProductoDoesNotExistError extends Error {
  constructor(id) {
    super();
    this.message = "Producto con id: " + id + " no existe.";
  }
}