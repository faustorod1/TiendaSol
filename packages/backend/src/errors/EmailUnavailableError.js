export class EmailUnavailableError extends Error {
    constructor() {
        super('El email ingresado ya está en uso.');
        this.name = 'EmailUnavailableError';
        
        this.statusCode = 409;
        this.status = 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}