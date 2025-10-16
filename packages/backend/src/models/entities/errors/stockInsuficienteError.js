export class StockInsuficienteError extends Error {

    /**
     * 
     * @param {Producto[]} productosFaltantes 
     */
    constructor(productosFaltantes) {
        this.name = "StockInsuficienteError";
        this.productosFaltantes = productosFaltantes;
        prodStr = this.productosFaltantes.map(prod => prod.nombre).toString();
        this.message = `No hay suficiente stock para los siguientes productos: ${prodStr}`;
    }
}