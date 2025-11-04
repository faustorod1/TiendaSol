export class CambioEstadoInvalidoError extends Error {
    constructor(estadoActual, estadoSolicitado, msg) {
        super(msg);
        this.name = 'CambioEstadoInvalidoError';
        this.estadoActual = estadoActual;
        this.estadoSolicitado = estadoSolicitado;
        this.isOperational = true;
    }
}