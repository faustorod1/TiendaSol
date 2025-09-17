class Pedido{
    /** @type string */
    id;
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
    /** @type CambioEstadoPedido[] */
    fechaCreacion;
    /** @type CambioEstadoPedido[] */
    historialEstados;
    /** @type Usuario */
    vendedor;

    /**
     * @param {string} id
     * @param {Usuario} comprador
     * @param {Usuario} vendedor
     * @param {ItemPedido[]} items 
     * @param {Moneda} moneda
     * @param {DireccionEntrega} direccionEntrega
     * @param {EstadoPedido} estado
     * @param {Date} fechaCreacion
     * @param {CambioEstadoPedido[]} historialEstados
     */
    constructor(id,comprador, vendedor, items, moneda, direccionEntrega){
        this.id = id;
        this.comprador = comprador;
        this.vendedor = vendedor;
        this.items = items;
        this.moneda = moneda;
        this.direccionEntrega = direccionEntrega;
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = new Date();
        this.historialEstados = [];

        const notificacion = FactoryNotification.crearSegunPedido(this);
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
     * @param {Usuario} usuario
     * @param {string} motivo
     */
    actualizarEstado(nuevoEstado, usuario, motivo){
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
}