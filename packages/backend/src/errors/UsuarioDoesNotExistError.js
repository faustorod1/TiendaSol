export class UsuarioDoesNotExistError extends Error {
  constructor(id) {
    super();
    this.message = "Usuario con id: " + id + " no existe.";
  }
}