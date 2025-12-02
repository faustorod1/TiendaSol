export class Notificacion {
    /** @type mongoose.Types.ObjectId */
    _id;
    /** @type Usuario */
    usuarioDestino;
    /** @type string */
    mensaje;
    /** @type date */
    fechaAlta;
    /** @type boolean */
    leida;
    /** @type date */
    fechaLeida;

    //------- methods -------//

    /**
     * @param {Usuario} usuarioDestino
     * @param {string} mensaje
     */
    constructor(usuarioDestino, mensaje) {
        
        this.usuarioDestino = usuarioDestino;
        this.mensaje = mensaje;
        this.fechaAlta = new Date();
        this.leida = false;
        this.fechaLeida = null;

        usuarioDestino.agregarNotificacion(this);
    }

    
    marcarComoLeida(){
        this.leida = true;
        this.fechaLeida = new Date();
    }
}