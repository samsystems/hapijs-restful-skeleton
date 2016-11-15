const internals = {};
const error = require('sequelize/lib/errors');
const Boom = require('boom');

internals.register = module.exports = (server, options, next) => {

    server.ext('onPreResponse', (request, reply) => {
        let response = request.response;

        if (request.method === 'options') {
            return reply.continue();
        }

        if (response.isBoom) {
            let resp = null;
            if (response instanceof error.EmptyResultError) {
                resp = Boom.notFound(response.message);
            } else if (response instanceof error.ValidationError) {
                resp = Boom.badData(response.message);
            }

            if (resp) {
                resp.reformat();
                resp.output.payload.errors = response.errors;
                return reply(resp);
            }
        }
        return reply.continue();
    });
    return next();
};

internals.register.attributes = {
    name: 'error-handler'
};
