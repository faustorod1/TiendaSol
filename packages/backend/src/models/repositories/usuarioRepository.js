import { UsuarioModel } from "../../schemas/usuarioSchema";

export class UsuarioRepository {

    constructor() {
        this.model = UsuarioModel;
    }

    async findAll() {
        return await this.model.find();
    }

    async findNotificationsByPage(filtro, limit, offset) {}

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