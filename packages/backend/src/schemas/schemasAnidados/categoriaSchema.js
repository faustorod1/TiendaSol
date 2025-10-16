import mongoose from 'mongoose';
import { Categoria } from '../../models/entities/categoria.js';

export const categoriaSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
    }
}, {
});

categoriaSchema.loadClass(Categoria);

export const CategoriaModel = mongoose.model('Categoria', categoriaSchema);