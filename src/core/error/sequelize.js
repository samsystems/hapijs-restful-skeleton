'use strict';
const Boom = require('boom')
    , {ValidationError, DatabaseError, ConnectionError} = require('sequelize/lib/errors/index');

module.exports = (error) => {
    if(error instanceof ValidationError) {
        return Boom.badRequest(error.message + ': ' + error.errors[0].message);
    }
    else if(error instanceof DatabaseError) {
        return Boom.internal(error.message + ': ' + error.errors[0].message);
    }
    else if(error instanceof ConnectionError) {
        return Boom.internal(error.message + ': ' + error.errors[0].message);
    }
    else {
        return Boom.internal('Some happens with database while process operation. Please try again later.');
    }
};