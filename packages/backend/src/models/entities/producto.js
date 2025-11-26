export class Producto {
    /** @type mongoose.Types.ObjectId */
    _id;
    /** @type Usuario */
    vendedor;
    /** @type string */
    titulo;
    /** @type string */
    descripcion;
    /** @type Categoria[] */
    categorias;
    /** @type number */
    precio;
    /** @type Moneda */
    moneda;
    /** @type number */
    stock;
    /** @type string[] */
    fotos;
    /** @type boolean */
    activo;
    /** @type number */
    cantidadVendida;

    /**
     * @param {Object} props - Objeto con las propiedades del producto
     */
    constructor({ 
        _id, 
        vendedor, 
        titulo, 
        descripcion, 
        categorias, 
        precio, 
        moneda, 
        stock, 
        fotos, 
        activo, 
        cantidadVendida 
    }) {
        this._id = _id;
        this.vendedor = vendedor;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias || [];
        this.precio = precio;
        this.moneda = moneda;
        this.fotos = fotos || [];
        this.activo = activo;

        this.stock = (stock !== undefined && stock !== null) ? Number(stock) : 0;
        this.cantidadVendida = (cantidadVendida !== undefined && cantidadVendida !== null) ? Number(cantidadVendida) : 0;
    }

    /**
     * @param {number} cantidad
     * @returns {boolean}
     */
    estaDisponible(cantidad) {
        return this.stock >= cantidad;
    }

    /**
     * @param {number} cantidad
     */
    reducirStock(cantidad) {
        this.stock -= cantidad;
    }

    /**
     * @param {number} cantidad
     */
    aumentarStock(cantidad) {
        this.stock += cantidad;
    }

    /**
     * @param {number} cantidad
     */
    vender(cantidad) {
        this.reducirStock(cantidad);
        this.cantidadVendida += cantidad;
    }
}