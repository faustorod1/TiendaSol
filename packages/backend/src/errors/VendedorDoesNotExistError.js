export class VendedorDoesNotExistError extends Error {
  constructor(id) {
    super();
    this.message = "Vendedor con id: " + id + " no existe.";
  }
}