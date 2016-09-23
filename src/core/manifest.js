const Confidence = require('confidence');
const Config = require('./config');

const criteria = {
    env: process.env.NODE_ENV
};

const manifest = {
    $meta: 'This file defines the plot device.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        host: Config.get('/host/api'),
        port: Config.get('/port/api'),
        labels: ['api']
    }],
    registrations: [
        {
            plugin: 'blipp'
        },
        {
            plugin: 'inert'
        },
        {
            plugin: 'vision'
        },
        {
            plugin: {
                register: 'hapi-swagger',
                options: {
                    consumes: ['application/hal+json'],
                    produces: ['application/hal+json'],
                    info: {
                        title: 'Hapijs Restful Skeleton',
                        version: require('../../package').version
                    }
                }
            }
        },
        {
            plugin: 'halacious'
        },
        {
            plugin: {
                register: 'good',
                options: {
                    ops: {
                        interval: 5000
                    },
                    reporters: Config.get('/good/reporters')
                }
            }
        },
        {
            plugin: 'hapi-info'
        }
    ]
};

const store = new Confidence.Store(manifest);

exports.get = function (key) {

    return store.get(key, criteria);
};

exports.meta = function (key) {

    return store.meta(key, criteria);
};
