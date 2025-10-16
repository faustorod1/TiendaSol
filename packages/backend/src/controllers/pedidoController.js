import { Pedido } from "../models/entities/pedido.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js"
import { Moneda } from "../models/entities/moneda.js"
import { StockInsuficienteError} from "../models/entities/errors/stockInsuficienteError.js"
import { z } from "zod";

export class PedidoController {
    costructor (pedidoService){
        this.pedidoService = pedidoService;
    }
    

    crearPedido(req, res){
        const pedidoSinValidar = {
            ...req.body,
            comprador: req.user.id
        };
        const pedidoResult = crearPedidoSchema.safeParse(pedidoSinValidar);
        if (!pedidoResult.success) {
            return res.status(400).json(pedidoResult.error.issues);
        }
        const pedido = pedidoResult.data;
        
        this.pedidoService.crearPedido(pedido)
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
        const params = {
            pedidoId: req.params.id,
            estadoNuevo: req.body.estado
        };

        const paramResult = cambiarEstadoSchema.safeParse(params);
        if (!paramResult.success) {
            return res.status(400).json(paramResult.error.issues);
        }
        const {pedidoId, estadoNuevo} = paramResult.data;
        
        const userIdResult = userIdSchema.safeParse(req.user.id);
        if (!userIdResult.success) {
            return res.status(400).json(userIdResult.error.issues);
        }
        const usuarioId = userIdResult.data;

        this.pedidoService.cambiarEstado(pedidoId, estadoNuevo, usuarioId, req.body.motivo)
        .then(() => {
            res.status(200).json({ message: "Estado del pedido actualizado con éxito" });
        })
        .catch((error) => {
            res.status(401).json({ error: error.message });
        });
    };



    consultarHistorialPedidos(req, res){
        const userIdResult = userIdSchema.safeParse(req.user.id);
        if (!userIdResult.success) {
            return res.status(400).json(userIdResult.error.issues);
        }
        const usuarioId = userIdResult.data;

        // todo: validar usuarioId, deberia ser un token stateful y deberia pasar por un middleware de autenticacion

        this.pedidoService.consultarHistorialPedidos(usuarioId)
            .then(historial => res.status(200).json(historial))
            .catch(error => res.status(400).json({ error: error.message }));
    };
}



// Schemas zod

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido');

// Si llega a tener formato cambia acá
const userIdSchema = objectIdSchema;

const cambiarEstadoSchema = z.object({
    pedidoId: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive()),
    estadoNuevo: z.enum(Object.values(EstadoPedido))
});

const itemPedidoSchema = z.object({
    productoId: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive()),
    cantidad: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive())
});

const crearPedidoSchema = z.object({
    comprador: userIdSchema,
    vendedor: userIdSchema,
    items: z.array(itemPedidoSchema).nonempty(),
    moneda: z.enum(Object.values(Moneda)),
    direccionEntrega: z.string()
});