import { Pedido } from "../models/entities/pedido.js";
import { ItemPedido } from "../models/entities/itemPedido.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js";
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
import { ProductoRepository } from "../models/repositories/productoRepository.js";
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js";
import { ProductoDoesNotExistError } from "../errors/ProductoDoesNotExistError.js";
import { PedidoDoesNotExistError } from "../errors/PedidoDoesNotExistError.js";
import { DireccionEntrega } from "../models/entities/direccionEntrega.js";

export class PedidoService {
    constructor(pedidoRepository, productoRepository, usuarioRepository) {
        this.pedidoRepository = pedidoRepository
        this.productoRepository = productoRepository
        this.usuarioRepository = usuarioRepository
    }

    async crearPedido(pedidoJSON){
        const comprador = await this.usuarioRepository.findById(pedidoJSON.comprador);
        const vendedor = await this.usuarioRepository.findById(pedidoJSON.vendedor);

        const idsProductos = pedidoJSON.items.map(item => item.productoId);
        const productos = await this.productoRepository.findManyById(idsProductos);
        const productosMap = new Map(productos.map(p => [p.id.toString(), p]));
        
        const items = pedidoJSON.items.map(item => {
            const producto = productosMap.get(item.productoId.toString());
            if (!producto) {
                throw new PedidoDoesNotExistError(item.productoId);
            }
            return new ItemPedido(producto, item.cantidad, producto.precio);
        });

        const direccionEntrega = new DireccionEntrega(pedidoJSON.direccionEntrega);

        const nuevoPedido = new Pedido(
            comprador,
            vendedor,
            items,
            pedidoJSON.moneda,
            direccionEntrega
        );

        await this.usuarioRepository.update(vendedor);
        await this.pedidoRepository.save(nuevoPedido);
    }

    async cambiarEstado(pedidoId, nuevoEstado, usuarioId, motivoNuevo){
        const pedido = await this.pedidoRepository.findById(pedidoId);
        switch (nuevoEstado) {
            case EstadoPedido.CANCELADO:
                if (pedido.comprador.id !== usuarioId) {
                    throw new Error("Solo el comprador puede marcar el pedido como cancelado");
                }
                await this.efectuarCambioEstado(pedidoId,nuevoEstado,motivoNuevo);

                break;
            case EstadoPedido.ENVIADO:
                if (pedido.vendedor.id !== usuarioId) {
                    throw new Error("Solo el vendedor puede marcar el pedido como enviado");
                }
                await this.efectuarCambioEstado(pedidoId,nuevoEstado,null);
                await this.productoRepository.incrementarVentasYReducirStock(pedido.items);

                break;
            default:
                break;
        }
    }

    async efectuarCambioEstado(pedidoId, nuevoEstado, motivoNuevo, usuario) {
        const pedido = await this.pedidoRepository.findById(pedidoId);
        pedido.actualizarEstado(nuevoEstado, nuevoEstado, usuario);
        await this.pedidoRepository.update(pedido);
        // Los guarda porque tienen nuevas notificaciones
        await this.usuarioRepository.update(pedido.comprador);
        await this.usuarioRepository.update(pedido.vendedor);
    }

    async consultarHistorialPedidos(idUsuario){
        return await this.pedidoRepository.consultarHistorialPedidos(idUsuario);
    }
}