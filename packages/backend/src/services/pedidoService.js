import { Pedido } from "../entities/pedido.js";
import { EstadoPedido } from "../entities/EstadoPedido.js"

class pedidoService {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository
    }

    async crearPedido(pedidoJSON){
        // TODO: El id no llega por la query. Ver de dónde sale y quién instancia cada cosa.
        // TODO: Los items vienen con menos info (ej: precio en el momento). Tal vez cuando esté el repo se puede arreglar
        const nuevoPedido = new Pedido(
            pedidoJSON.id,
            pedidoJSON.comprador,
            pedidoJSON.vendedor,
            pedidoJSON.items,
            pedidoJSON.moneda,
            pedidoJSON.direccionEntrega
        )

        await this.pedidoRepository.crearPedido(nuevoPedido)
    }

    async cambiarEstado(pedidoId, nuevoEstado, usuarioId){
        const pedido = await this.pedidoRepository.findById(pedidoId)
        switch (nuevoEstado) {
            case EstadoPedido.CANCELADO:
                if (pedido.comprador.id !== usuarioId) {
                    throw new Error("Solo el comprador puede marcar el pedido como cancelado");
                }
                break;
            case EstadoPedido.ENVIADO:
                if (pedido.vendedor.id !== usuarioId) {
                    throw new Error("Solo el vendedor puede marcar el pedido como enviado");
                }
                break;
            default:
                break;
        }
        
        await this.pedidoRepository.cambiarEstado(pedidoId, nuevoEstado)
    }

    async consultarHistorialPedidos(idUsuario){
        return await this.pedidoRepository.consultarHistorialPedidos(idUsuario);
    }
}