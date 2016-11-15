const BaseException = require('./base');

module.exports = class LogicException extends BaseException {

    constructor(msg, code) {
        super('Logic Error', msg, code ? code : 409);
    }
};