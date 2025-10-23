import mongoose from 'mongoose';
import { Producto } from '../models/entities/producto.js';
import { Moneda } from '../models/entities/moneda.js'
import { categoriaSchema } from './schemasAnidados/categoriaSchema.js';

const productoSchema = new mongoose.Schema({
    vendedor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    titulo:{
        type: String,
        required: true,
    },
    descripcion:{
        type: String,
        required: true,
    },
    categorias: {
        type: [categoriaSchema],
        required: true,
    },
    precio:{
        type: Number,
        required: true,
        min: 0,
    },
    moneda:{
        type: String,
        required: true,
        trim: true,
        enum: Object.values(Moneda),
    },
    stock:{
        type: Number,
        required: true,
        min: 0,
    },
    fotos:{
        type: [String],
        required: false,
    },
    activo:{
        type: Boolean,
        required: true,
    },
    cantidadVendida: {
        type: Number,
        required: true,
        default: 0,
    }
},{
    timestamps: true,
    collection: 'productos'
});

productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model('Producto', productoSchema);