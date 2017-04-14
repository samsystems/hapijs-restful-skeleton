const BaseException = require('./base');

module.exports = class BadRequestException extends BaseException {

    constructor(msg, code) {
        super('Bad Request', msg, code ? code : 400);
    }
};