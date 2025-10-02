import { UsuarioModel } from "../../schemas/usuarioSchema";

export class UsuarioRepository {

    constructor() {
        this.model = UsuarioModel;
    }

    async findAll() {
        return await this.model.find();
    }

    async findNotificationsByPage(filtro, limit, offset) {
        const { usuarioId, leida } = filtro;

        // Busca el usuario por ID
        const usuario = await this.model.findById(usuarioId).lean();
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

}