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

    async findByEmail(email) {
        return await this.model.findOne({email: email});
    }

    async findNotificationsByPage(filtro, limit, offset) {
        const { usuarioId, leida } = filtro;
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(usuarioId);

        const matchStage = { $match: { _id: objUsuario } };

        const projectStage = {
            $project: {
            _id: 0,
            notificaciones: {
                $filter: {
                input: "$notificaciones",
                as: "n",
                cond: typeof leida === "boolean" ? { $eq: ["$$n.leida", leida] } : {}
                }
            }
            }
        };

        const addPagination = [
            matchStage,
            projectStage,
            { $unwind: "$notificaciones" },
            { $skip: offset },
            { $limit: limit },
            { $group: { _id: null, rows: { $push: "$notificaciones" } } }
        ];

        const result = await this.model.aggregate(addPagination);
        
        // Para contar cuántas hay (sin paginar)
        const countStage = [
            matchStage,
            projectStage,
            { $unwind: "$notificaciones" },
            { $count: "total" }
        ];
        const countResult = await this.model.aggregate(countStage);

        const count = countResult[0]?.total || 0;
        const rows = result[0]?.rows || [];

        return { rows, count };
    }

    async save(usuario, password) {
        const usuarioParaGuardar = {
            ...usuario,
            password: password
        };
        const nuevoUsuario = new this.model(usuarioParaGuardar);
        return await nuevoUsuario.save();
    }

    async updateById(id, usuario) {
        return await this.model.findByIdAndUpdate(id, usuario, { new: true });
    }

    // Solo sirve si usuario es un documento de mongo
    async update(usuario) {
        return await usuario.save();
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }


    async marcarNotificacionComoLeida(usuarioId, notificacionId) {
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(usuarioId);
        await this.model.findOneAndUpdate(
            { _id: objUsuario,"notificaciones._id": notificacionId },
            { $set: { "notificaciones.$.leida": true, "notificaciones.$.fechaLeida": new Date() }}
        );
        const usuarioActualizado = await this.model.findOne(
            { _id: objUsuario,"notificaciones._id": notificacionId },
            { "notificaciones.$": 1 }
        )

        // El resultado de la proyección es un documento de usuario que contiene
        // únicamente el array 'notificaciones' con un solo elemento dentro.
        return usuarioActualizado?.notificaciones?.[0] || null;
    }
}