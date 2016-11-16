const BaseException = require('./base');

module.exports = class EntityNotFoundException extends BaseException {

    constructor(msg, code) {
        super('Entity Not Found', msg, code ? code : 404);
    }
};