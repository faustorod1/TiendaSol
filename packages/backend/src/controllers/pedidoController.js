import { EstadoPedido } from "../models/entities/estadoPedido.js"
import { Moneda } from "../models/entities/moneda.js"
import { z } from "zod";

export class PedidoController {
    constructor (pedidoService){
        this.pedidoService = pedidoService;
    }
    

    async crearPedido(req, res){
        const pedidoSinValidar = {
            ...req.body,
            comprador: req.user.id
        };
        const pedidoResult = crearPedidoSchema.safeParse(pedidoSinValidar);
        if (!pedidoResult.success) {
            return res.status(400).json(pedidoResult.error.issues);
        }
        const pedido = pedidoResult.data;

        const pedidoGenerado = await this.pedidoService.crearPedido(pedido);
        return res.status(201).json({ message: "Pedido creado con éxito", _id: pedidoGenerado._id });
    };



    async cambiarEstado(req, res){
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

        await this.pedidoService.cambiarEstado(pedidoId, estadoNuevo, usuarioId, req.body.motivo);
        res.status(200).json({ message: "Estado del pedido actualizado con éxito" });
    };



    async consultarHistorialPedidos(req, res){
        const userIdResult = userIdSchema.safeParse(req.user.id);
        if (!userIdResult.success) {
            return res.status(400).json(userIdResult.error.issues);
        }
        const usuarioId = userIdResult.data;

        const historial = await this.pedidoService.consultarHistorialPedidos(usuarioId, req.user.tipo);
        res.status(200).json(historial);
    };
}



// Schemas zod

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido');

// Si llega a tener formato cambia acá
const userIdSchema = objectIdSchema;

const cambiarEstadoSchema = z.object({
    pedidoId: objectIdSchema,
    estadoNuevo: z.enum(Object.values(EstadoPedido))
});

const itemPedidoSchema = z.object({
    productoId: objectIdSchema,
    cantidad: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive())
});

const direccionEntregaSchema = z.object({
    calle: z.string().min(1, "Calle es obligatoria"),
    altura: z.string().min(1, "Altura es obligatoria"),
    piso: z.string().optional(),
    departamento: z.string().optional(),
    codigoPostal: z.string().min(1, "Código postal es obligatorio"),
    ciudad: z.string().min(1, "Ciudad es obligatoria"),
    provincia: z.string().min(1, "Provincia es obligatoria"),
    pais: z.string().min(1, "País es obligatorio"),
    lat: z.string().optional(),
    lon: z.string().optional()
});

const crearPedidoSchema = z.object({
    comprador: userIdSchema,
    vendedor: userIdSchema,
    items: z.array(itemPedidoSchema).nonempty(),
    moneda: z.enum(Object.values(Moneda)),
    direccionEntrega: direccionEntregaSchema
});