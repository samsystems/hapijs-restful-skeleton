const Hoek = require('hoek');

const internals = {
    STATUS_CODES: Object.setPrototypeOf({
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Moved Temporarily',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '307': 'Temporary Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Time-out',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Request Entity Too Large',
        '414': 'Request-URI Too Large',
        '415': 'Unsupported Media Type',
        '416': 'Requested Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '422': 'Unprocessable Entity',
        '423': 'Locked',
        '424': 'Failed Dependency',
        '425': 'Unordered Collection',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '451': 'Unavailable For Legal Reasons',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Time-out',
        '505': 'HTTP Version Not Supported',
        '506': 'Variant Also Negotiates',
        '507': 'Insufficient Storage',
        '509': 'Bandwidth Limit Exceeded',
        '510': 'Not Extended',
        '511': 'Network Authentication Required'
    }, null)
};

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
            : internals.STATUS_CODES[this.output.statusCode] || 'Unknown';

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
        this.message = response.output.payload.message || '';
        this.output.statusCode = response.output.statusCode;
        this.title = null;
        this.reformat();
        return this;
    }
}