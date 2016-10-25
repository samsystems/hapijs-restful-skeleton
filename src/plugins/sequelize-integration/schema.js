'use strict';

const Joi = require('joi');

const internals = {};

internals.option = exports.option = Joi.object().keys({
    name: Joi.string().token().required(),
    models: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
    config: Joi.object().keys({
        host: Joi.string().ip({
            version: [
                'ipv4',
                'ipv6'
            ],
            cidr: 'optional'
        }),
        database: Joi.string().token().required(),
        username: Joi.string().token().required(),
        password: Joi.string().token().required(),
        dialect: Joi.string().token().required()

    }),
    schema: Joi.string().default('public'),
    sync: Joi.boolean().default(false),
    forceSync: Joi.boolean().default(false),
    debug: Joi.boolean()
});

exports.options = Joi.alternatives().try(Joi.array().items(internals.option), internals.option);
