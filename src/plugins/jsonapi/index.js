"use strict";
const internals = {};
const _ = require('lodash');
const instanceModel = require('sequelize/lib/instance');
const Exception = require('../../core/error/base');
const BadRequestException = require('../../core/error/bad-request-exception');

internals.register = module.exports = (server, options, next) => {
    let mediaTypes = 'application/vnd.api+json';

    internals.isModelInstance = (instance) => {
        return instance instanceof instanceModel;
    };

    internals.onPreResponse = (request, reply) => {
        let response = request.response;

        if (!response.isBoom && request.headers.accept == mediaTypes) {
            let payLoad = {
                links: {
                    self: request.connection.info.uri + request.path
                },
                data: []
            };

            if (_.isArray(response.source)) {
                payLoad.data = _.map(response.source, (instance) => {
                    if (internals.isModelInstance(instance)) {
                        return instance.toJsonApi()
                    } else {
                        return instance;
                    }
                })
            } else {
                payLoad.data = internals.isModelInstance(response.source)
                    ? response.source.toJsonApi()
                    : _.cloneDeep(response.source)
            }
            return reply(payLoad);
        }
        else if (response.isBoom && request.headers.accept == mediaTypes){
            if(!(response instanceof Exception)){
                switch (response.output.statusCode){

                    default:
                        return reply(new Exception(null, null, 500).fromResponse(response));
                        break;
                }
            }
        }
        return reply.continue();
    };

    server.ext('onPreResponse', internals.onPreResponse);

    return next();
};

internals.register.attributes = {
    name: 'jsonapi'
};
