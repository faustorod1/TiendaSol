export class ForbiddenError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'ForbiddenError';
        
        this.statusCode = 403;
        this.status = 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}