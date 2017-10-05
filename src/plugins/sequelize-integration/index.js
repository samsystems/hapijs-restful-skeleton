'use strict';

const Joi = require('joi');
const Schema = require('./schema');
const Models = require('./models');
const DB = require('./DB');
const Sequelize = require('sequelize');
const _ = require('lodash');
const Path = require('path');

// Module globals
const internals = {
    pluginName: 'sequelize-integration'
};

internals.configure = function (opts) {
    opts.sequelize = new Sequelize(opts.config.database, opts.config.username, opts.config.password, opts.config);

    return opts.sequelize.authenticate().then(() => {

        if (opts.models) {

            return Models.getFiles(opts.models)
                .then((files) => {
                    return Models.load(files, opts.sequelize.import.bind(opts.sequelize))
                        .then((models) => Models.applyRelations(models))
                        .then((models) => {

                            if (opts.sync) {
                                return opts.sequelize.sync({force: opts.forceSync})
                                    .then(() => Promise.resolve(new DB(opts.sequelize, models)));
                            } else {
                                return Promise.resolve(new DB(opts.sequelize, models));
                            }
                        });
                });

        } else {
            return Promise.resolve(new DB(opts.sequelize, []));
        }
    });
};

exports.register = function (server, options, next) {
    if (!options) return next('Missing sequelize-integration plugin options');
    if (!Array.isArray(options)) options = [options];

    const validation = Joi.validate(options, Schema.options);
    if (!validation || validation.error) return next(validation.error);

    const getDb = (request) => {
        return function getDb(name) {
            if (!name || !request.server.plugins[internals.pluginName].hasOwnProperty(name)) {
                const key = Object.keys(request.server.plugins[internals.pluginName]).shift();
                return request.server.plugins[internals.pluginName][key];
            }
            return request.server.plugins[internals.pluginName][name];
        };
    };

    server.decorate('request', 'getDb', getDb, {apply: true});
    server.decorate('server', 'getDb', function (name) {
        if (!name || !this.plugins[internals.pluginName].hasOwnProperty(name)) {
            const key = Object.keys(this.plugins[internals.pluginName]).shift();
            return this.plugins[internals.pluginName][key];
        }
        return this.plugins[internals.pluginName][name];
    });

    const configured = options.reduce((acc, opts) => {
        return [].concat(acc, [
            internals.configure(opts)
                .then((db) => {
                    server.expose(opts.name, db);
                    return Promise.resolve(db);
                })
        ]);
    }, []);

    Promise.all(configured)
        .then(() => {
            return next();
        })
        .catch((err) => {
            return next(err);
        });
};

exports.register.attributes = {
    name: internals.pluginName
};
