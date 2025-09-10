class CambioEstadoPedido {
    /** @type date */
    fecha;
    /** @type EstadoPedido */
    estado;
    /** @type Pedido */
    pedido;
    /** @type Usuario */
    usuario;
    /** @type string */
    motivo;

    /**
     * @param {date} fecha
     * @param {EstadoPedido} estado
     * @param {Pedido} pedido
     * @param {Usuario} usuario
     * @param {string} motivo
     */
    constructor(fecha, estado, pedido, usuario, motivo) {
        this.fecha = fecha;
        this.estado = estado;
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo;
    }
}