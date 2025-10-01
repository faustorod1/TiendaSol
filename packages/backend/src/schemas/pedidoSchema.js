import mongoose from 'mongoose';
import { Moneda } from '../models/entities/moneda.js'
import { usuarioSchema } from '../usuarioSchema.js';
import { direccionEntregaSchema } from '../schemasAnidados/direccionEntregaSchema.js'
import { estadoPedido } from '../models/entities/estadoPedido.js';

const productoSchema = new mongoose.Schema({
    comprador:{
        type: usuarioSchema,
        required: true,
    },
    vendedor:{
        type: usuarioSchema,
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
    collection: 'productos'
});

pedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model('Pedido', pedidoSchema);