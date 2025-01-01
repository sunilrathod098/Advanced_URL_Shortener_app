class ApiError extends Error {
    constructor(
        message = 'An error occurred',
        statusCode,
        error = [],
        stack = ''
    ){
        super(message);
        this.data = null;
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
        this.data = null;
        this.stack = stack;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;