import { Notificacion } from "../entities/notificacion.js";

import { z } from "zod";

export class usuarioController {
    costructor(usuarioService){
        this.usuarioService = usuarioService;
    }

    async obtenerNotificaciones(req, res) {
        const { usuarioId } = req.params;
        const { leida, page = 1, limit = 10 } = req.query;

        try {
            const paginated = await this.usuarioService.obtenerNotificaciones(usuarioId, leida, {
            page: parseInt(page),
            limit: parseInt(limit)
            });

            res.status(200).json(paginated);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener notificaciones' });
        }
    }

    async marcarNotificacionComoLeida(req, res) {
        const { usuarioId, id } = req.params;

        try {
            const notificacion = await this.usuarioService.marcarNotificacionComoLeida(usuarioId, id);

            if (!notificacion) {
            return res.status(404).json({ error: 'Notificación no encontrada o no pertenece al usuario' });
            }

            res.status(200).json({
            mensaje: 'Notificación marcada como leída',
            notificacion
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la notificación' });
        }
    }
}