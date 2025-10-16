import { Pedido } from "../models/entities/pedido.js";
import { ItemPedido } from "../models/entities/itemPedido.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js"
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
import { ProductoRepository } from "../models/repositories/productoRepository.js";
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js";
import { ProductoDoesNotExistError } from "../errors/ProductoDoesNotExistError.js";
import { PedidoDoesNotExistError } from "../errors/PedidoDoesNotExistError.js";

export class PedidoService {
    constructor(pedidoRepository, productoRepository, usuarioRepository) {
        this.pedidoRepository = pedidoRepository
        this.productoRepository = productoRepository
        this.usuarioRepository = usuarioRepository
    }

    async crearPedido(pedidoJSON){
        const comprador = this.usuarioRepository.findById(pedidoJSON.comprador);
        const vendedor = this.usuarioRepository.findById(pedidoJSON.vendedor);

        const idsProductos = pedidoJSON.items.map(item => item.productoId);
        const productos = this.productoRepository.findManyById(idsProductos);
        const productosMap = new Map(productos.map(p => [p.id.toString(), p]));
        
        const items = pedidoJSON.items.map(item => {
            const producto = productosMap.get(item.productoId.toString());
            if (!producto) {
                throw new PedidoDoesNotExistError(item.productoId);
            }
            return new ItemPedido(producto, item.cantidad, producto.precio);
        });

        const nuevoPedido = new Pedido(
            comprador,
            vendedor,
            items,
            pedidoJSON.moneda,
            pedidoJSON.direccionEntrega
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
        const pedido = this.pedidoRepository.findById(pedidoId);
        pedido.actualizarEstado(nuevoEstado, nuevoEstado, usuario);
        this.pedidoRepository.update(pedido);
        // Los guarda porque tienen nuevas notificaciones
        this.usuarioRepository.update(pedido.comprador);
        this.usuarioRepository.update(pedido.vendedor);
    }

    async consultarHistorialPedidos(idUsuario){
        return await this.pedidoRepository.consultarHistorialPedidos(idUsuario);
    }
}