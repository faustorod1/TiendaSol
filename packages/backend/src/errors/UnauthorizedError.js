export class UnauthorizedError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'UnauthorizedError';
        
        this.statusCode = 401;
        this.status = 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}