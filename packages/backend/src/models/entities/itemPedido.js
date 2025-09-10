class itemPedido{
    /** @type {Producto} */
    producto;
    /** @type {integer} */
    cantidad;
    /** @type {double} */
    precioUnitario;

    /**
     * @param {Producto} productom
     * @param {integer} cantidad
     * @param {double} precioUnitario
     */
    constructor(producto, cantidad, precioUnitario) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }


    //------- methods -------//

    subtotal() {
        return this.cantidad * this.precioUnitario;
    }
}