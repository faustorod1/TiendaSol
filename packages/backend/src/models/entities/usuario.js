class Usuario{
    /** @type string */
    id;
    /** @type string */
    nombre;
    /** @type string */
    telefono;
    /** @type TipoUsuario */
    tipo;
    /** @type Date */
    fechaAlta;
    /** @type Notificacion[] */
    notificaciones;

    /**
     * @param {string} id
     * @param {string} nombre
     * @param {string} email
     * @param {string} telefono
     * @param {TipoUsuario} tipo
     * @param {Date} fechaAlta
     * @param {Notificacion[]} notificaciones
     */
    constructor(id, nombre, email, telefono, tipo, fechaAlta) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.tipo = tipo;
        this.fechaAlta = fechaAlta;
        this.notificaciones = [];
    }

    /**
     * @param {Notificacion} notificacion
     */
    agregarNotificacion(notificacion) {
        this.notificaciones.push(notificacion);
    }
}