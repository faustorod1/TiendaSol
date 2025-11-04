import { VendedorDoesNotExistError } from "../errors/VendedorDoesNotExistError.js";

export function vendedorErrorHandler(err, _req, res, next) {
  console.log(err.message);

  if (err.constructor.name == VendedorDoesNotExistError.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  next(err);
}