import { ItemPedido } from "../itemPedido.js";

export class StockInsuficienteError extends Error {

    /**
     * 
     * @param {ItemPedido[]} productosFaltantes 
     */
    constructor(productosFaltantes) {
        const productosYCantidades = productosFaltantes.map(item => `${item.producto.titulo}: ${item.cantidad}`);
        
        const prodStr = productosYCantidades.join(", ");
        super(`No hay suficiente stock para los siguientes productos: ${prodStr}`);

        this.name = "StockInsuficienteError";
        this.productosFaltantes = productosFaltantes.map(item => ({
            producto: {
                _id: item.producto._id.toString(),
                titulo: item.producto.titulo
            },
            cantidad: item.cantidad
        }));
        this.isOperational = true;
    }
}