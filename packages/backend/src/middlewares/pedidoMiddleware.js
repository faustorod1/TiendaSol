import { PedidoDoesNotExistError } from "../errors/PedidoDoesNotExistError.js";
import { CambioEstadoInvalidoError } from "../models/entities/errors/cambioEstadoInvalidoError.js";
import { StockInsuficienteError } from "../models/entities/errors/stockInsuficienteError.js";

export function pedidoErrorHandler(err, _req, res, next) {
  console.log(err.message);

  if (err.constructor.name == PedidoDoesNotExistError.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  if (err.constructor.name == StockInsuficienteError.name) {
      return res.status(409).json({
          message: "Stock insuficiente de productos",
          productosFaltantes: err.productosFaltantes
      });
  }

  if (err.constructor.name == CambioEstadoInvalidoError.name) {
    return res.status(409).json({
      message: err.message,
      estadoActual: err.estadoActual,
      estadoSolicitado: err.estadoSolicitado
    });
  }

  next(err);
}