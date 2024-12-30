export class ApiError extends Error {
    constructor(
        message = 'An error occurred',
        errors = [],
        statusCode,
        stack = ''
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.message = message;
        this.data = null;
        if (stack) {
            this.stack = stack;
        } else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}