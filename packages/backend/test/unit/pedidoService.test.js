import { jest } from "@jest/globals"
import { pedidoService } from "../../src/services/pedidoService.js"
import { Pedido } from "../../src/models/pedido.js"
import { Usuario } from "../../src/models/usuario.js"
import { Producto } from "../../src/models/producto.js"
import { EstadoPedido } from "../../src/models/estadoPedido.js"

describe("pedidoService.cambiarEstado", () => {
    const mockRepo = {
        findById: jest.fn(),
    }

    const pedidoService = new pedidoService(mockRepo);

    test("No comprador no puede cancelar el pedido", async () => {

        const comprador = new Usuario({ id: 1, nombre: "Comprador" });
        const otroUsuario = new Usuario({ id: 3, nombre: "Otro" });
        const vendedor = new Usuario({ id: 2, nombre: "Vendedor" });
        const producto = new Producto({ id: 1, nombre: "Producto", precio: 100, vendedorId: vendedor.id });
        const pedido = new Pedido({
            id: 1,
            compradorId: comprador.id,
            productoId: producto.id,
            estado: EstadoPedido.PENDIENTE,
            comprador,
            vendedor
        });
        
        mockRepo.findById.mockResolvedValue(pedido);
        await expect(
            pedidoService.cambiarEstado(pedido.id, EstadoPedido.CANCELADO, otroUsuario.id)
        ).rejects.toThrow("Solo el comprador puede marcar el pedido como cancelado");
    });
});