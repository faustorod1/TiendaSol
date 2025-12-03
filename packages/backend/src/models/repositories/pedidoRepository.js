import { PedidoModel } from "../../schemas/pedidoSchema.js";
import { Pedido } from "../entities/pedido.js";
import { ItemPedido } from "../entities/itemPedido.js";
import { Usuario } from "../entities/usuario.js";
import { Producto } from "../entities/producto.js";
import mongoose from "mongoose";
import { DireccionEntrega } from "../entities/direccionEntrega.js";
//import { CambioEstadoPedido } from "../../schemas/CambioEstadoPedido.js"

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    generarId() {
        return new mongoose.Types.ObjectId();
    }

    async save(pedido) {
        const pedidoParaGuardar = {
            _id: pedido._id,
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

    async findById(id, populate = {}) {
        let query = this.model.findById(id);

        const { populateUsuarios, populateProductos } = populate;
        if (populateUsuarios) {
            query = query.populate('comprador').populate('vendedor');
        }
        if (populateProductos) {
            query = query.populate('items.producto');
        }
    
        const pedidoDoc = await query.lean();
        if (!pedidoDoc) return null;

        let comprador = pedidoDoc.comprador;
        let vendedor = pedidoDoc.vendedor;

        if (populateUsuarios) {
            if (comprador) comprador = new Usuario(comprador);
            if (vendedor) vendedor = new Usuario(vendedor);
        }

        const items = pedidoDoc.items.map(item => {
            let producto = item.producto;
            if (populateProductos && producto) {
                producto = new Producto(producto); 
            }
            console.log(producto);
            
            return new ItemPedido(
                producto,
                item.cantidad,
                item.precioUnitario
            );
        });

        return new Pedido({
            _id: pedidoDoc._id,
            comprador: comprador,
            vendedor: vendedor,
            items: items,
            moneda: pedidoDoc.moneda,
            direccionEntrega: new DireccionEntrega(pedidoDoc.direccionEntrega),
            
            estado: pedidoDoc.estado,
            fechaCreacion: pedidoDoc.fechaCreacion,
            historialEstados: pedidoDoc.historialEstados
        });
    }

    async consultarHistorialPedidos(id_usuario) {
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(id_usuario);
        return await this.model.find({ "comprador": objUsuario });
    }
    async consultarHistorialPedidosVendidos(id_usuario) {
        const objUsuario = mongoose.Types.ObjectId.createFromHexString(id_usuario);
        return await this.model.find({ "vendedor": objUsuario });
    }

    async update(pedido) {
        const datosParaGuardar = {
            estado: pedido.estado,
            fechaCreacion: pedido.fechaCreacion,
            historialEstados: pedido.historialEstados,
            
            items: pedido.items.map(item => ({
                producto: item.producto._id ? item.producto._id : item.producto,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
            })),

            historialEstados: pedido.historialEstados.map(h => ({
                fecha: h.fecha,
                estado: h.estado,
                motivo: h.motivo,
                usuario: h.usuario._id || h.usuario,
            })),
        };

        const resultado = await this.model.findByIdAndUpdate(
            pedido._id, 
            datosParaGuardar,
            { new: true }
        );
        return resultado;
    }
}