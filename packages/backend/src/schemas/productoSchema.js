import mongoose from 'mongoose';
import { Producto } from '../models/entities/producto.js';
import { usuarioSchema } from '../usuarioSchema.js';
import { categoriaSchema } from '../schemasAnidados/categoriaSchema.js';
import { Moneda } from '../models/entities/moneda.js'

const productoSchema = new mongoose.Schema({
    vendedor:{
        type: usuarioSchema,
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
        
    }
},{
    timestamps: true,
    collection: 'productos'
});

productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model('Producto', productoSchema);
