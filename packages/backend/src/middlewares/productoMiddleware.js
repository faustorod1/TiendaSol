import { ProductoDoesNotExistError } from "../errors/ProductoDoesNotExistError.js";

export function productoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  if (err.constructor.name == ProductoDoesNotExistError.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}