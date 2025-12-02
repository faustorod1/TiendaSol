import mongoose from 'mongoose';
import { Categoria } from '../../models/entities/categoria.js';

export const categoriaSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    nombre:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
}, {
    _id: false,
});

categoriaSchema.loadClass(Categoria);

export const CategoriaModel = mongoose.model('Categoria', categoriaSchema);