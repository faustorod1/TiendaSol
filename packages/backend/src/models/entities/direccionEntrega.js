export class DireccionEntrega {
    /** @type string */
    calle;
    /** @type string */
    altura;
    /** @type string */
    piso;
    /** @type string */
    departamento;
    /** @type string */
    codigoPostal;
    /** @type string */
    ciudad;
    /** @type string */
    provincia;
    /** @type string */
    pais;
    /** @type string */
    lat;
    /** @type string */
    lon;

    /**
     * @param {string} calle
     * @param {string} altura
     * @param {string} piso
     * @param {string} departamento
     * @param {string} codigoPostal
     * @param {string} ciudad
     * @param {string} provincia
     * @param {string} pais
     * @param {string} lat
     * @param {string} lon
     */
    constructor(calle, altura, piso, departamento, codigoPostal, ciudad, provincia, pais, lat, lon) {
        this.calle = calle;
        this.altura = altura;
        this.piso = piso;
        this.departamento = departamento;
        this.codigoPostal = codigoPostal;
        this.ciudad = ciudad;
        this.provincia = provincia;
        this.pais = pais;
        this.lat = lat;
        this.lon = lon;
    }

    
    pasarAString() {
        return `${this.calle} ${this.altura}, ${this.piso} ${this.departamento}, ${this.ciudad}, ${this.provincia}, ${this.pais} - ${this.codigoPostal}`;
    }
}
