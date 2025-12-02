export class Categoria{
    /** @type mongoose.Types.ObjectId */
    _id;
    /** @type {string} */
    nombre;

    /** 
     * @param {string} nombre
     */
    constructor(nombre) {
        this.nombre = nombre;
    }
}