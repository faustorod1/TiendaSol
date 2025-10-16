import mongoose from 'mongoose';
import { Usuario } from '../models/entities/usuario.js';
import { TipoUsuario } from '../models/entities/tipoUsuario.js';
import { notificacionSchema } from './schemasAnidados/notificacionSchema.js';

const usuarioSchema = new mongoose.Schema({  
    nombre:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    telefono:{
        type: String,
        required: true,
        trim: true,
    },
    tipo: {
        type: String,
        required: true,
        trim: true,
        enum: Object.values(TipoUsuario),
    },
    fechaAlta:{
        type: Date,
        required: true,
        trim: true,
    },
    notificaciones:{    // !pensamos en que notificacion podria tener al usuario y a la hora de hidratar el programa cuando se lee la coleccion de notificaciones se instancia al usario con todas sus notificaciones.
        type: [notificacionSchema],
        required: false,
    },
},{
    
    timestamps: true,
    collection: 'usuarios'
});


usuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);