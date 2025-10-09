import { Notificacion } from "../entities/notificacion.js";

import { z } from "zod";

export class usuarioController {
    costructor(usuarioService){
        this.usuarioService = usuarioService;
    }

    async obtenerNotificaciones(req, res) {
        const reqSinValidar = {
            ...req.query,
            usuarioId: req.user.id
        };

        const reqResult = obtenerNotificacionesSchema.safeParse(reqSinValidar);
        if (!reqResult.success) {
            return res.status(400).json(reqResult.error.issues);
        }
        const { usuarioId, leida, page, limit } = reqResult.data;

        try {
            const paginated = await this.usuarioService.obtenerNotificaciones(usuarioId, leida, {
                page: page,
                limit: limit
            });

            res.status(200).json(paginated);
        } catch (error) {
            res.status(500).json({ error: error.message || 'Error al obtener notificaciones' });
        }
    }

    async marcarNotificacionComoLeida(req, res) {
        const reqSinValidar = {
            id: req.params.id,
            usuarioId: req.user.id
        }
        const reqResult = marcarNotificacionComoLeidaSchema.safeParse(reqSinValidar);
        if (!reqResult.success) {
            return res.status(400).json(reqResult.error.issues);
        }
        const { usuarioId, id } = reqResult.data;

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

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido');

const obtenerNotificacionesSchema = z.object({
    usuarioId: objectIdSchema,
    page: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive())
        .default("1"),
    limit: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().min(1).max(100))
        .default("10"),
    leida: booleanSchema
});

const marcarNotificacionComoLeidaSchema = z.object({
    id: objectIdSchema,
    usuarioId: objectIdSchema
});

const booleanSchema = z.string().transform((v, ctx) => {
  if (v === "true") return true;
  if (v === "false") return false;

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Debe ser 'true' o 'false'"
  });
  return z.NEVER; // le dice a Zod que el parseo falló
});