import { Usuario } from '../models/usuario.js';
import { Notificacion } from '../models/notificacion.js';
export class usuarioService {
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
            page,
            limit,
            notificaciones: rows
        };
    }

  async marcarNotificacionComoLeida(usuarioId, id) {
    const notificacion = await this.Notificacion.findOne({ where: { id, usuarioId } });
    if (!notificacion) return null;

    notificacion.leida = true;
    await notificacion.save();
    return notificacion;
  }
}