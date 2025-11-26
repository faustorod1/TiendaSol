import { Pedido } from "../models/entities/pedido.js";
import { ItemPedido } from "../models/entities/itemPedido.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js";
import { TipoUsuario } from "../models/entities/tipoUsuario.js";
import { PedidoDoesNotExistError } from "../errors/PedidoDoesNotExistError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { DireccionEntrega } from "../models/entities/direccionEntrega.js";
import { ProductoDoesNotExistError } from "../errors/ProductoDoesNotExistError.js";

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
        const productosMap = new Map(productos.map(p => [p._id.toString(), p]));
        
        const items = pedidoJSON.items.map(item => {
            const producto = productosMap.get(item.productoId.toString());
            if (!producto) {
                throw new PedidoDoesNotExistError(item.productoId);
            }
            return new ItemPedido(producto, item.cantidad, producto.precio);
        });

        const direccionEntrega = new DireccionEntrega(pedidoJSON.direccionEntrega);

        // Puedo generar un id antes de persistirlo, por cómo lo crea no se va a pisar con otro
        const idGenerado = this.pedidoRepository.generarId();

        const nuevoPedido = new Pedido(
            idGenerado,
            comprador,
            vendedor,
            items,
            pedidoJSON.moneda,
            direccionEntrega
        );

        const result = await this.pedidoRepository.save(nuevoPedido);
        await this.productoRepository.updateStockYVentas(productos);
        await this.usuarioRepository.dispatchNotifications(vendedor);
        return result;
    }

    async obtenerPedidoPorId(pedidoId){
        const pedido = await this.pedidoRepository.findById(pedidoId, false);
        if(pedido === null) {
            throw new PedidoDoesNotExistError(pedidoId);
        }
        
        return pedido;
    }

    async cambiarEstado(pedidoId, nuevoEstado, usuarioId, motivoNuevo){
        const pedido = await this.pedidoRepository.findById(pedidoId, true);

        switch (nuevoEstado) {
            case EstadoPedido.CANCELADO:
                if (pedido.comprador.id !== usuarioId) {
                    throw new ForbiddenError("Solo el comprador puede marcar el pedido como cancelado");
                }

                // Cargo los productos al pedido para que se les actualice el stock
                await this.popularProductosDePedido(pedido);
                
                pedido.cancelar(pedido.comprador, motivoNuevo);

                // Les aumentó el stock
                const productosModificados = pedido.items.map(item => item.producto);

                await this.pedidoRepository.update(pedido);
                await this.productoRepository.updateStockYVentas(productosModificados);
                await this.usuarioRepository.dispatchNotifications(pedido.vendedor);
                
                break;
            case EstadoPedido.ENVIADO:
                if (pedido.vendedor.id !== usuarioId) {
                    throw new ForbiddenError("Solo el vendedor puede marcar el pedido como enviado");
                }
                await this.efectuarCambioEstado(pedido, nuevoEstado, pedido.vendedor, motivoNuevo);

                break;
            default:
                break;
        }
    }

    async efectuarCambioEstado(pedido, nuevoEstado, usuario, motivoNuevo) {
        pedido.actualizarEstado(nuevoEstado, usuario, motivoNuevo);
        await this.pedidoRepository.update(pedido);
        // Los guarda porque tienen nuevas notificaciones
        await this.usuarioRepository.dispatchNotifications(pedido.comprador);
        await this.usuarioRepository.dispatchNotifications(pedido.vendedor);
    }

    // Esto modifica al pedido recibido
    async popularProductosDePedido(pedido) {
        const ids = pedido.items.map(item => item.producto._id);
        const productos = await this.productoRepository.findManyById(ids);
        const productosMap = new Map(productos.map(p => [p._id.toString(), p]));

        pedido.items.forEach(item => {
            const prod = productosMap.get(item.producto.toString());
            if (!prod) {
                throw new ProductoDoesNotExistError(item.producto);
            }
            item.producto = prod;
        });
    }

    async consultarHistorialPedidos(idUsuario, tipoUsuario){
        if (tipoUsuario === TipoUsuario.VENDEDOR) {
            return await this.pedidoRepository.consultarHistorialPedidosVendidos(idUsuario);
        } else {
            return await this.pedidoRepository.consultarHistorialPedidos(idUsuario);
        }
    }
}