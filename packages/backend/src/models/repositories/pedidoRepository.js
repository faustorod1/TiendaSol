import { PedidoModel } from "../../schemas/pedidoSchema";

export class PedidoRepository { //todo implementar la paginacion
    constructor() {
        this.model = PedidoModel;
    }

    async save(pedido) {
        const nuevoPedido = new this.model(pedido);
        return await nuevoPedido.save();
    }

    async findAll(){
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }
    
    async cambiarEstado(pedidoId, nuevoEstado, motivoNuevo, usuario) {
        try {
            const pedido = await this.model.findById(pedidoId);
            if (!pedido) throw new Error('Pedido no encontrado');

            const cambioEstado = new CambioEstadoPedido(pedido, pedido.estado, pedido.motivo);
            pedido.historialEstados.push(cambioEstado);

            pedido.actualizarEstado(nuevoEstado, usuario, motivoNuevo);

            await this.save(pedido);
            return pedido;
        } catch (error) {
            console.error('Error al cambiar estado del pedido:', error);
            throw error;
        }
    }
    async consultarHistorialPedidos(id_usuario) {//todo
        return await this.model.array.findAll().filter(pedido => {
             pedido.getComprador().getId().equals(id_usuario);
        });
    }

    
}