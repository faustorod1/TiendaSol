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
     * @param {string} id
     * @param {Usuario} vendedor
     * @param {string} titulo
     * @param {string} descripcion
     * @param {Categoria[]} categorias
     * @param {number} precio
     * @param {Moneda} moneda
     * @param {number} stock
     * @param {string[]} fotos
     * @param {boolean} activo
     */
    constructor(id, vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo) {
        this._id = id;
        this.vendedor = vendedor;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias;
        this.precio = precio;
        this.moneda = moneda;
        this.stock = stock;
        this.fotos = fotos;
        this.activo = activo;
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