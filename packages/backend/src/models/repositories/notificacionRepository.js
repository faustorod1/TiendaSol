import { NotificacionModel } from "../../schemas/schemasAnidados/notificacionSchema.js";
import mongoose from "mongoose";


export class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    async findByPage(page, limit, filtros) {
        const { usuarioId, leida } = filtros;
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(usuarioId);

        const skip = (page - 1) * limit;

        const filtrosValidos = { usuarioDestino: objUsuario };
        if (typeof leida === 'boolean') {
            filtrosValidos.leida = leida;
        }

        const queryUnread = { usuarioDestino: objUsuario, leida: false };

        // Esto ejecuta las 3 queries en paralelo
        const [notificaciones, totalFiltered, totalUnread] = await Promise.all([
            this.model.find(filtrosValidos)
                .sort({ fechaAlta: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            // Cuenta cuántas hay en total (que cumplan los filtros) para paginar
            this.model.countDocuments(filtrosValidos),
            // Cuenta cuántas hay no leídas en total, para mostrar en el ícono de notificación
            this.model.countDocuments(queryUnread)
        ]);
        
        const totalPages = Math.ceil(totalFiltered / limit);

        return {
            page: page,
            perPage: limit,
            total: totalFiltered,
            totalPages: totalPages,
            totalUnreadCount: totalUnread,
            data: notificaciones
        }
    }


    async save(notificacion) {
        const document = this._entityToDocument(notificacion);
        const model = new NotificacionModel(document);
        return await model.save();
    }

    async insertMany(notificaciones) {
        const paraGuardar = notificaciones.map(this._entityToDocument);
        return await this.model.insertMany(paraGuardar);
    }

    _entityToDocument(notificacion) {
        return {
            ...notificacion,
            usuarioDestino: mongoose.Types.ObjectId.createFromHexString(notificacion.usuarioDestino.id)
        };
    }


    async marcarComoLeida(usuarioId, notificacionId) {
        const notificacionActualizada = await this.model.findOneAndUpdate(
            { _id: notificacionId, usuarioId: usuarioId },
            { 
                $set: { 
                    leida: true, 
                    fechaLeida: new Date() 
                } 
            },
            { new: true, lean: true }
        );
        return notificacionActualizada;
    }
}