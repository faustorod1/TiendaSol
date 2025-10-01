import mongoose from 'mongoose';
import { DireccionEntrega } from '../models/entities/direccionEntrega.js';

const direccionEntregaSchema = new mongoose.Schema({
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
        required: true,
        trim: true,
    },
    departamento: {
        type: String,
        required: true,
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
        required: true,
        trim: true,
    },
    lon: {
        type: String,
        required: true,
        trim: true,
    },
});

direccionEntregaSchema.loadClass(DireccionEntrega);

export const CDireccionEntregaModel = mongoose.model('DireccionEntrega', direccionEntregaSchema);

