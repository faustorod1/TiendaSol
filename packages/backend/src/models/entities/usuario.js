/**
 * @typedef {Object} UsuarioProps
 * @property {mongoose.Types.ObjectId | string} _id
 * @property {string} nombre
 * @property {string} email
 * @property {string} [telefono] - Opcional
 * @property {TipoUsuario} tipo
 * @property {Date} [fechaAlta] - Opcional, se puede inicializar por defecto
 * @property {Notificacion[]} [notificaciones] - Opcional
 */

export class Usuario {
    /** @type mongoose.Types.ObjectId | string */
    _id;
    /** @type string */
    nombre;
    /** @type string */
    email;
    /** @type string */
    telefono;
    /** @type TipoUsuario */
    tipo;
    /** @type Date */
    fechaAlta;
    /** @type Notificacion[] */
    notificaciones;

    /**
     * @param {UsuarioProps} props - Objeto de propiedades del usuario
     */
    constructor({ _id, nombre, email, telefono, tipo, fechaAlta, notificaciones }) {
        this._id = _id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.tipo = tipo;
        
        this.fechaAlta = fechaAlta || new Date(); 
        this.notificaciones = notificaciones || [];
    }

    // --- Métodos de Dominio ---

    /**
     * @param {Notificacion} notificacion
     */
    agregarNotificacion(notificacion) {
        this.notificaciones.push(notificacion);
    }
}