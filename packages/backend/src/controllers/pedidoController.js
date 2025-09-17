import { Pedido } from "../entities/pedido.js";
import { StockInsuficienteError} from "../entities/errors/StockInsuficienteError.js"
import { z } from "zod";

// Creación de un pedido, validando el stock disponible de cada producto.
// Cancelación de un pedido antes de que haya sido enviado.
// Consulta del historial de pedidos de un usuario.
// Marcado de un pedido como enviado por parte del vendedor.

export class pedidoController {
    costructor (pedidoService){
        this.pedidoService = pedidoService;
    }
    // {
    //     comprador: 2,
    //     vendedor: 4,
    //     items: [
    //         {
                
    //         },
    //         {
                
    //         }
    //     ]
    // }

    crearPedido(req, res){
        const pedido = req.body.productos;
        if (!pedido) {
            return res.status(400).json({ error: "Error en los datos enviados" });
        }
        
        this.pedidoService.crearPedido(productos)
        .then(() => res.status(201).json({ message: "Pedido creado con éxito" }))
        .catch(error => {
            if (error.constructor.name == StockInsuficienteError.name) {
                return res.status(409).json({
                    error: "Stock insuficiente de productos",
                    productosFaltantes: error.productosFaltantes.map(producto => producto.nombre)
                });
            }
            throw error
        })
    };

    cambiarEstado(req, res){
        const pedidoId = req.params.id;
        const estadoNuevo = req.body.estado;
        const usuarioId = req.user.id;//TODO: validar este usuario id
        if (pedidoId <= 0) {
            return res.status(400).json({ error: "ID de pedido no válido" });
        }
        else if (!estadoNuevo) {
            return res.status(400).json({ error: "Error en el estado enviado" });
        }
        this.pedidoService.cambiarEstado(pedidoId, estadoNuevo, usuarioId)
        .then(() => {
            res.status(200).json({ message: "Estado del pedido actualizado con éxito" });
        })
        .catch((error) => {
            res.status(401).json({ error: error.message });
        });
    };

    consultarHistorialPedidos(req, res){
        const idUsuario = req.user.id;

        // todo: validar idUsuario, deberia ser un token stateful y deberia pasar por un middleware de autenticacion

        this.pedidoService.consultarHistorialPedidos(idUsuario)
            .then(historial => res.status(200).json(historial))
            .catch(error => res.status(400).json({ error: error.message }));
    };
}