import mongoose from 'mongoose';
import { Notificacion } from '../../models/entities/notificacion.js';

export const notificacionSchema = new mongoose.Schema({
    usuarioDestino: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        index: true,
    },
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
});

notificacionSchema.index({ usuarioDestino: 1 });
notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);