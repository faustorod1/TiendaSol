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
    password: {
        type: String,
        required: true,
        select: false // Para que no lo traiga en las queries si no especifico
    },
    telefono:{
        type: String,
        required: false,
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
    }
},{
    
    timestamps: true,
    collection: 'usuarios'
});


usuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);