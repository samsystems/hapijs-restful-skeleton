const Hoek = require('hoek');
const http = require('http');

module.exports = class BaseException extends Error {

    constructor(title, msg, statusCode) {
        super(msg);
        this.isBoom = true;
        this.title = title;

        const numberCode = parseInt(statusCode, 10);
        Hoek.assert(!isNaN(numberCode) && numberCode >= 400, 'First argument must be a number (400+):', statusCode);

        this.isServer = numberCode >= 500;

        this.output = {
            statusCode: numberCode,
            payload: {
                errors: []
            },
            headers: {
                accept: 'application/vnd.api+json'
            }
        };
        Error.stackTraceLimit = 2;

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);

        this.reformat();
    }

    reformat() {
        let errors = this.output.payload.errors;
        let error = {
            status: this.output.statusCode,
            // Not implemented yet
            // source: {
            //     pointer: ""
            // }
        };
        error.title = this.title
            ? this.title
            : http.STATUS_CODES[this.output.statusCode] || 'Unknown';

        if (error.status === 500) {
            error.message = 'An internal server error occurred';              // Hide actual error from user
        }
        else if (this.message) {
            error.message = this.message;
        }
        errors.push(error);
    };

    fromResponse(response){
        this.output.payload.errors = [];
        this.message = response.message || response.output.payload.message;
        this.output.statusCode = response.output.statusCode;
        this.title = null;
        this.reformat();
        return this;
    }
}