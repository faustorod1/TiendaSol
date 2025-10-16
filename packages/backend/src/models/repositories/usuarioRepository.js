import { UsuarioModel } from "../../schemas/usuarioSchema.js";
import mongoose from "mongoose";

export class UsuarioRepository {

    constructor() {
        this.model = UsuarioModel;
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(usuarioId) {
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(usuarioId);
        return await this.model.findById(objUsuario);
    }

    async findNotificationsByPage(filtro, limit, offset) {
        const { usuarioId, leida } = filtro;

        const objUsuario = mongoose.Types.ObjectId.createFromHexString(usuarioId);
        // Busca el usuario por ID
        const usuario = await this.model.findById(objUsuario).lean();
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        if (!usuario.notificaciones) return { rows: [], count: 0 };

        // Filtra por si la notificación fue leída o no
        let notificaciones = usuario.notificaciones;
        if (typeof leida === "boolean") {
            notificaciones = notificaciones.filter(n => n.leida === leida);
        }

        const count = notificaciones.length;
        const rows = notificaciones.slice(offset, offset + limit);

        return { rows, count };
    }

    async save(usuario) {
        const nuevoUsuario = new this.model(usuario);
        return await nuevoUsuario.save();
    }

    async update(id, usuario) {
        return await this.model.findByIdAndUpdate(id, usuario, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
 
    async marcarNotificacionComoLeida(usuarioId, notificacionId) {
        const resultado = await UsuarioModel.updateOne(
            { _id: usuarioId },
            // 2. Operación de actualización: Modifica solo el campo 'leida' del elemento del array.
            { $set: { "notificaciones.$[elem].leida": true } },
            // 3. Opciones: Aquí le decimos a MongoDB cómo encontrar el elemento 'elem' correcto.
            {
                arrayFilters: [
                    { "elem._id": notificacionId }
                ]
            }
        );
        return resultado.modifiedCount === 1;
    }

    async marcarNotificacionComoLeida(usuarioId, notificacionId) {
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(usuarioId);
        const usuarioActualizado = await UsuarioModel.findOneAndUpdate(
            { _id: objUsuario,"notificaciones._id": notificacionId },
            { $set: { "notificaciones.$.leida": true }},
            { new: true, projection: { "notificaciones.$": 1 }}
        );
        // El resultado de la proyección es un documento de usuario que contiene
        // únicamente el array 'notificaciones' con un solo elemento dentro.
        if (usuarioActualizado && usuarioActualizado.notificaciones.length > 0) {
            return usuarioActualizado.notificaciones[0]; // Devolvemos el objeto de la notificación
        }
        return null; 
    }
}