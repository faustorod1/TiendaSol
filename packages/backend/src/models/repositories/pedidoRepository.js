import { PedidoModel } from "../../schemas/pedidoSchema.js";
import mongoose from "mongoose";
//import { CambioEstadoPedido } from "../../schemas/CambioEstadoPedido.js"

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    async save(pedido) {
        const pedidoParaGuardar = {
            comprador: mongoose.Types.ObjectId.createFromHexString(pedido.comprador.id),
            vendedor: mongoose.Types.ObjectId.createFromHexString(pedido.vendedor.id),

            items: pedido.items.map(item => ({
                producto: mongoose.Types.ObjectId.createFromHexString(item.producto.id),
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario 
            })),
            moneda: pedido.moneda,
            direccionEntrega: pedido.direccionEntrega,
            estado: pedido.estado,
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
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(id_usuario);
        return await this.model.find({ "comprador_id": objUsuario });
    }
}