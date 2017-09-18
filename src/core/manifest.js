const Confidence = require('confidence');
const config = require('./config');

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
        host: config.get('/host/api'),
        port: config.get('/port/api'),
        labels: ['api'],
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['token']
            },
            auth:false
        }
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
            plugin: 'scooter'
        },
        {
            plugin: 'hapi-swagger'
        },
        {
            plugin: {
                register: 'good',
                options: {
                    ops: {
                        interval: 5000
                    },
                    reporters: config.get('/good/reporters')
                }
            }
        },
        {
            plugin: 'hapi-info'
        },
        {
            plugin: {
                register: '@samsystems/hapi-sequelize',
                options: [
                    {
                        models: ['./src/models/entity/*.js'],  // paths/globs to model files
                        repository: './src/models/repository/*.js',  // paths to model files
                        config: config.get('/sequelize'), // sequelize config
                        sync: true, // sync models - default false
                        forceSync: false // force sync (drops tables) - default false
                    }
                ]
            },
        },
        {
            plugin: {
                register: './loader',
                options: config.get('/loader')
            }
        },
        {
            plugin: {
                register: './jsonapi'
            }
        },
        {
            plugin: {
                register: '@samsystems/hapi-twilio-integration',
                options: config.get('/twilio')
            }
        },
        {
            plugin: {
                register: 'hapi-query-filters',
                options: {
                    ignoredKeys: ['limit', 'page', 'sort', 'fields']
                }
            }
        },
        {
            plugin: {
                register: './mongo',
                options: config.get('/mongo')
            }
        }
    ]
};

module.exports = new Confidence.Store(manifest);
