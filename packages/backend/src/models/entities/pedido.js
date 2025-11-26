import { EstadoPedido } from "./estadoPedido.js";
import { FactoryNotification } from "./factoryNotification.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js";
import { CambioEstadoInvalidoError } from "./errors/cambioEstadoInvalidoError.js";
import { StockInsuficienteError } from "./errors/stockInsuficienteError.js";

/**
 * @typedef {Object} PedidoProps
 * @property {mongoose.Types.ObjectId} _id
 * @property {Usuario} comprador
 * @property {Usuario} vendedor
 * @property {ItemPedido[]} items
 * @property {Moneda} moneda
 * @property {DireccionEntrega} direccionEntrega
 * @property {EstadoPedido} [estado] - Opcional (viene de DB)
 * @property {Date} [fechaCreacion] - Opcional (viene de DB)
 * @property {CambioEstadoPedido[]} [historialEstados] - Opcional (viene de DB)
 */

export class Pedido{
    
    /** @type mongoose.Types.ObjectId */
    _id;
    /** @type Usuario */
    comprador;
    /** @type Usuario */
    vendedor;
    /** @type ItemPedido[] */
    items;
    /** @type Moneda */
    moneda;
    /** @type DireccionEntrega */
    direccionEntrega;
    /** @type EstadoPedido */
    estado;
    /** @type Date */
    fechaCreacion;
    /** @type CambioEstadoPedido[] */
    historialEstados;
    

    /**
     * Constructor único que recibe un objeto de propiedades.
     * @param {PedidoProps} props 
     */
    constructor({ 
        _id, 
        comprador, 
        vendedor, 
        items, 
        moneda, 
        direccionEntrega, 
        estado, 
        fechaCreacion, 
        historialEstados 
    }) {
        this._id = _id;
        this.comprador = comprador;
        this.vendedor = vendedor;
        this.items = items;
        this.moneda = moneda;
        this.direccionEntrega = direccionEntrega;

        this.estado = estado || EstadoPedido.PENDIENTE;
        this.fechaCreacion = fechaCreacion || new Date();
        this.historialEstados = historialEstados || [];
    }

    /**
     * Factory method para nuevos pedidos.
     * También recibe un objeto para mantener consistencia.
     */
    static crearNuevo({ _id, comprador, vendedor, items, moneda, direccionEntrega }) {
        const pedido = new Pedido({
            _id, 
            comprador, 
            vendedor, 
            items, 
            moneda, 
            direccionEntrega
        });

        pedido.validarStock();
        FactoryNotification.crearSegunPedido(pedido);
        
        pedido.items.forEach(item => {
            item.producto.vender(item.cantidad);
        });

        return pedido;
    }


    //------- methods -------//

    /**
     * @returns number
     */
    calcularTotal(){
        return this.items.reduce((acum, item) => acum + item.subtotal(), 0);
    }

    /**
     * @param {EstadoPedido} nuevoEstado
     * @param {string} motivo
     */
    cancelar(usuario, motivo) {
        if (!this.sePuedeCancelar()) {
            throw new CambioEstadoInvalidoError(
                this.estado,
                EstadoPedido.CANCELADO,
                `El pedido de id ${this._id} no se puede cancelar porque ya fue enviado.`
            );
        }
        this.actualizarEstado(EstadoPedido.CANCELADO, usuario, motivo);
        this.items.forEach(item => {
            item.producto.aumentarStock(item.cantidad)
        });
    }

    /**
     * @param {EstadoPedido} nuevoEstado
     * @param {Usuario} usuario
     * @param {string} motivo
     */
    actualizarEstado(nuevoEstado, usuario, motivo){
        if (this.estado === "CANCELADO") {
            throw new CambioEstadoInvalidoError(
                this.estado,
                nuevoEstado,
                `El pedido de id ${this._id} no puede pasar a ${nuevoEstado} porque ya fue cancelado.`
            );
        }
        this.estado = nuevoEstado;

        FactoryNotification.crearSegunPedido(this);
        
        const unCambioEstadoPedido = new CambioEstadoPedido(new Date(), nuevoEstado, this, usuario, motivo);
        this.historialEstados.push(unCambioEstadoPedido);
    }

    validarStock(){
        const productosFaltantes = this.items.filter(item => !item.producto.estaDisponible(item.cantidad)); 
        if(productosFaltantes.length > 0) {
            throw new StockInsuficienteError(productosFaltantes);
        }
    }

    sePuedeCancelar() {
        return ![EstadoPedido.ENVIADO, EstadoPedido.ENTREGADO].includes(this.estado);
    }
}