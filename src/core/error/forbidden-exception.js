const BaseException = require('./base');

module.exports = class ForbiddenException extends BaseException {

    constructor(msg, code) {
        super('Access Denied', msg, code ? code : 403);
    }
};