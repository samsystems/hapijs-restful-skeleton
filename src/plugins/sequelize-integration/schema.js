'use strict';

const Joi = require('joi');
const Sequelize = require('sequelize');

const internals = {};

internals.option = exports.option = Joi.object().keys({
    env: Joi.string().default('development'),
    name: Joi.string().token().required(),
    models: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
    config: Joi.object().required(),
    schema: Joi.string().default('public'),
    sync: Joi.boolean().default(false),
    forceSync: Joi.boolean().default(false),
    debug: Joi.boolean()
});

exports.options = Joi.alternatives().try(Joi.array().items(internals.option), internals.option);
