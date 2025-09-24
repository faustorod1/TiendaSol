import { jest } from "@jest/globals"
import { FactoryNotification } from "../../src/models/factoryNotification.js"
import { Notificacion } from "../../src/models/notificacion.js"
import { Pedido } from "../../src/models/pedido.js"
import { Usuario } from "../../src/models/usuario.js"
import { Moneda } from "../../src/models/moneda.js"

describe("factoryNotification.crearSegunPedido", () => {

    const factoryNotification = new factoryNotification();

    // Crear instancias reales de Usuario y Pedido
    const vendedor = new Usuario({ id: 10, nombre: "VendedorTest" });
    const comprador = new Usuario({ id: 20, nombre: "CompradorTest" });
    const direccionEntrega = { pasarAString: () => "Calle Falsa 123" };
    const producto = { nombre: "Producto Test" };
    const itemPedido = { producto };
    const pedido = new Pedido({
        id: "PED-2",
        vendedor,
        comprador,
        items: [itemPedido],
        direccionEntrega,
        moneda: Moneda.PESO_ARG
    });

    test("Al crear un pedido, el vendedor recibe una notificación", () => { 
        expect(vendedor.notificaciones.length).toBeGreaterThan(0);
    });

    test("Al cambiar estado a enviado, el comprador recibe una notificación", () => { 
        pedido.actualizarEstado(estadoPedido.ENVIADO, vendedor, "Cambio de estado a ENVIADO");
        expect(comprador.notificaciones.length).toBeGreaterThan(0);
        expect(pedido.historialEstados.length).toBeGreaterThan(1);
    });

    // Crear un producto con stock insuficiente
    const productoSinStock = {
        nombre: "Producto Sin Stock",
        estaDisponible: () => false
    };
    const itemSinStock = { producto: productoSinStock };
    // Agregar el item al pedido
    pedido.items.push(itemSinStock);

    test("Al validar stock del pedido con item sin stock, se devuelve error", () => {
        expect(() => pedido.validarStock()).toThrow();
    });
})