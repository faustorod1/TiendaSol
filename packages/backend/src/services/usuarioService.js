import { Usuario } from '../models/entities/usuario.js';
import { Notificacion } from '../models/entities/notificacion.js';
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js";
import { NotificacionDoesNotExistError } from '../errors/NotificacionDoesNotExistError.js';

export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async obtenerNotificaciones(usuarioId, leida, { page, limit }) {
        const filtro = { usuarioId };
        if (leida !== undefined) {
            filtro.leida = leida;
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await this.usuarioRepository.findNotificationsByPage(filtro, limit, offset);

        const totalPaginas = Math.ceil(count / limit);

        return {
            page: page,
            perPage: limit,
            total: count,
            totalPages: totalPaginas,
            data: rows
        };
    }

  async marcarNotificacionComoLeida(usuarioId, id) {
    const notificacionActualizada = await this.usuarioRepository.marcarNotificacionComoLeida(usuarioId, id);
    if (notificacionActualizada === null) {
      throw new NotificacionDoesNotExistError(usuarioId, id);
    }

    return notificacionActualizada;
  }
}