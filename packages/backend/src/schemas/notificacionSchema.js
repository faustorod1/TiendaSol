import mongoose from 'mongoose';
import { Notificacion } from '../models/entities/notificacion.js';

export const notificacionSchema = new mongoose.Schema({
    mensaje: {
        type: String,
        required: true,
        trim: true,
    },
    fechaAlta: {
        type: Date,
        required: true,
        default: Date.now,
    },
    leida: {
        type: Boolean,
        required: true,
        default: false,
    },
    fechaLeida: {
        type: Date,
        required: false,
    }
}, {
    id: false
});


notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);