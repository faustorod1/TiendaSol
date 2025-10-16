import mongoose from 'mongoose';
import { Pedido } from '../models/entities/pedido.js';
import { Moneda } from '../models/entities/moneda.js'
import { EstadoPedido } from '../models/entities/estadoPedido.js';
import { direccionEntregaSchema } from './schemasAnidados/direccionEntregaSchema.js'
import { itemPedidoSchema } from './schemasAnidados/itemPedidoSchema.js';
import { cambioEstadoPedidoSchema } from './schemasAnidados/cambioEstadoPedidoSchema.js'

const pedidoSchema = new mongoose.Schema({
    comprador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comprador_id",
        required: true,
    },
    vendedor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendedor_id",
        required: true,
    },

    items:{
        type: [itemPedidoSchema],
        required: true,
    },
    moneda:{
        type: String,
        required: true,
        trim: true,
        enum: Object.values(Moneda),
    },
    direccionEntrega:{
        type: direccionEntregaSchema,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        trim: true,
        enum: Object.values(EstadoPedido),
    },
    fechaCreacion: {
        type: Date,
        required: true,
    },
    historialEstados: {
        type: [cambioEstadoPedidoSchema],
        required: true,
    }
    },{
    timestamps: true,
    collection: 'pedidos'
});

pedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model('Pedido', pedidoSchema);