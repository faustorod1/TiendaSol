import mongoose from 'mongoose';
import { CambioEstadoPedido } from '../../models/entities/cambioEstadoPedido.js';
import { EstadoPedido } from '../../models/entities/estadoPedido.js';

export const cambioEstadoPedidoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        trim: true,
        enum: Object.values(EstadoPedido),
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    motivo: {
        type: String,
        trim: true,
        nulleable: true,
    },
}, {
});

cambioEstadoPedidoSchema.loadClass(CambioEstadoPedido);

export const CambioEstadoPedidoModel = mongoose.model('CambioEstadoPedido', cambioEstadoPedidoSchema);