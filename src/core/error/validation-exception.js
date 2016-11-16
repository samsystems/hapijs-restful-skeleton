const BaseException = require('./base');

module.exports = class ValidationException extends BaseException {

    constructor(msg, code) {
        super('Unprocessable Entity', msg, code ? code : 422);
    }
};