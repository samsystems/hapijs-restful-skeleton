const BaseException = require('./base');

module.exports = class UnauthorizedException extends BaseException {

    constructor(msg, code) {
        super('Unauthorized', msg, code ? code : 401);
    }
};