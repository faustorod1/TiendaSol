import mongoose from 'mongoose';
import { ItemPedido } from '../models/entities/itemPedido.js';
import { productoSchema } from '.productoSchema.js';

export const itemPedidoSchema = new mongoose.Schema({
    producto:{
        type: productoSchema,
        required: true,
    },
    cantidad:{
        type: Number,
        required: true,
    },
    precioUnitario:{
        type: Number,
        required: true,
    }
}, {
});

itemPedidoSchema.loadClass(ItemPedido);

export const ItemPedidoModel = mongoose.model('ItemPedido', itemPedidoSchema);