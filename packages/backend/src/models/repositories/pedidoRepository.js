import { PedidoModel } from "../../schemas/pedidoSchema";
import { CambioEstadoPedido } from "../../schemas/cambioEstadoPedido.js"

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    // TODO
    async crearPedido(nuevoPedido){}

    async save(pedido) {
        const nuevoPedido = new this.model(pedido);
        return await nuevoPedido.save();
    }

    async findByPage(nroPagina, elemsXPagina) {
        return await this.model.find()
            .skip((nroPagina - 1) * elemsXPagina)
            .limit(elemsXPagina);
    }

    async findAll(){
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async consultarHistorialPedidos(id_usuario) {
        return await this.model.find({ "comprador.id": id_usuario });
    }
}