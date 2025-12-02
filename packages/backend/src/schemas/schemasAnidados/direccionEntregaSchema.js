import mongoose from 'mongoose';
import { DireccionEntrega } from '../../models/entities/direccionEntrega.js';

export const direccionEntregaSchema = new mongoose.Schema({
    calle: {
        type: String,
        required: true,
        trim: true,
    },
    altura: {
        type: String,
        required: true,
        trim: true,
    },
    piso: {
        type: String,
        trim: true,
    },
    departamento: {
        type: String,
        trim: true, 
    },
    codigoPostal: {
        type: String,
        required: true,
        trim: true,
    },
    ciudad: {
        type: String,
        required: true,
        trim: true,
    },
    provincia: {
        type: String,
        required: true,
        trim: true,
    },
    pais: {
        type: String,
        required: true,
        trim: true,
    },
    lat: {
        type: String,
        trim: true,
    },
    lon: {
        type: String,
        trim: true,
    },
});

direccionEntregaSchema.loadClass(DireccionEntrega);

export const DireccionEntregaModel = mongoose.model('DireccionEntrega', direccionEntregaSchema);

