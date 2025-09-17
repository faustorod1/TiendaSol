import { PedidoDoesNotExistError } from "../errors/PedidoDoesNotExistError.js";

export function pedidoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  if (err.constructor.name == PedidoDoesNotExistError.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}