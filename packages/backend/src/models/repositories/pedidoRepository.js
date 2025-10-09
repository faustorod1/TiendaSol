import { PedidoModel } from "../../schemas/pedidoSchema";
import { CambioEstadoPedido } from "../../schemas/cambioEstadoPedido.js"

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    async save(pedido) {
        const pedidoParaGuardar = {
            comprador: pedido.comprador.id,
            vendedor: pedido.vendedor.id,

            items: pedido.items.map(item => ({
                producto: item.producto.id,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario 
            })),
            moneda: pedido.moneda,
            direccionEntrega: pedido.direccionEntrega,
            estado: pedido.estado 
        };

        const nuevoPedidoModel = new PedidoModel(pedidoParaGuardar);
        return await nuevoPedidoModel.save();
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