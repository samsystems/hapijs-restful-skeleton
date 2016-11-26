'use strict';

const Joi = require('joi');
const Sequelize = require('sequelize');

const internals = {};

internals.option = exports.option = Joi.object().keys({
    name: Joi.string().token().required(),
    models: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
    repository: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
    config: Joi.object().keys({
        host: Joi.alternatives().try(Joi.string().ip({
            version: [
                'ipv4',
                'ipv6'
            ],
            cidr: 'optional'
        }), Joi.string().hostname()),
        port: Joi.number().integer().default(3306),
        database: Joi.string().token().required(),
        username: Joi.string().token().required(),
        password: Joi.string().token().required(),
        dialect: Joi.string().token().required()

    }),
    sync: Joi.boolean().default(false),
    forceSync: Joi.boolean().default(false),
    debug: Joi.boolean()
});

exports.options = Joi.alternatives().try(Joi.array().items(internals.option), internals.option);
