import { Usuario } from '../models/entities/usuario.js';
import { Notificacion } from '../models/entities/notificacion.js';
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js"

export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async obtenerNotificaciones(usuarioId, leida, { page, limit }) {
        const filtro = { usuarioId };
        if (leida !== undefined) {
            filtro.leida = leida === 'true';
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await this.usuarioRepository.findNotificationsByPage(filtro, limit, offset);

        return {
            total: count,
            page: page,
            limit: limit,
            notificaciones: rows
        };
    }

  async marcarNotificacionComoLeida(usuarioId, id) {
    const notificacionActualizada = await this.usuarioRepository.marcarNotificacionComoLeida(usuarioId, id);
    if (notificacionActualizada === null) {
      throw new Error("No se pudo encontrar la notificación para marcarla como leída.");
    }

    return notificacionActualizada;
  }
}