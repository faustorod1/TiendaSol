import { NotificacionDoesNotExistError } from "../errors/NotificacionDoesNotExistError.js";
import { UsuarioDoesNotExistError } from "../errors/UsuarioDoesNotExistError.js";

export function usuarioErrorHandler(err, _req, res, next) {
  console.log(err.message);

  if (err.constructor.name == UsuarioDoesNotExistError.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  if (err.constructor.name == NotificacionDoesNotExistError.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  next(err);
}