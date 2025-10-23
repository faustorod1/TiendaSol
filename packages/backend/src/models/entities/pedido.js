import { EstadoPedido } from "./estadoPedido.js";
import { FactoryNotification } from "./factoryNotification.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js";
import { StockInsuficienteError } from "./errors/stockInsuficienteError.js";

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
     * @param {mongoose.Types.ObjectId} _id
     * @param {Usuario} comprador
     * @param {Usuario} vendedor
     * @param {ItemPedido[]} items 
     * @param {Moneda} moneda
     * @param {DireccionEntrega} direccionEntrega
     * @param {Date} fechaCreacion
     * @param {CambioEstadoPedido[]} historialEstados
     */
    constructor(_id, comprador, vendedor, items, moneda, direccionEntrega){
        this._id = _id;
        this.comprador = comprador;
        this.vendedor = vendedor;
        this.items = items;
        this.moneda = moneda;
        this.estado = EstadoPedido.PENDIENTE;
        this.direccionEntrega = direccionEntrega;
        this.fechaCreacion = new Date();
        this.historialEstados = [];

        this.validarStock();

        FactoryNotification.crearSegunPedido(this);
        
        this.items.forEach(item => {
            item.producto.vender(item.cantidad);
        });
        //notificacion.notificar();//ver si lo hacemos asi o no
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
            throw new Error(`El pedido de id ${this._id} no se puede cancelar porque ya fue enviado.`);
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
            throw new Error(`El pedido de id ${this._id} no puede pasar a ${nuevoEstado} porque ya fue cancelado.`);
        }
        this.estado = nuevoEstado;

        FactoryNotification.crearSegunPedido(this);
        
        const unCambioEstadoPedido = new CambioEstadoPedido(new Date(), nuevoEstado, this, usuario, motivo);
        this.historialEstados.push(unCambioEstadoPedido);
    }

    validarStock(){
        console.log(this);
        
        const productosFaltantes = this.items.filter(item => !item.producto.estaDisponible(item.cantidad)); 
        if(productosFaltantes.length > 0) {
            throw new StockInsuficienteError(productosFaltantes);
        }
    }

    sePuedeCancelar() {
        return ![EstadoPedido.ENVIADO, EstadoPedido.ENTREGADO].includes(this.estado);
    }
}