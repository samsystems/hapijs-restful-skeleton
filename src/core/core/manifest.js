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
            plugin: {
                register: 'hapi-swagger',
                options: {
                    consumes: ['application/vnd.api+json', 'application/json'],
                    produces: ['application/vnd.api+json', 'application/json'],
                }
            }
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
            plugin: 'hapi-auth-jwt2'
        },
        {
            plugin: {
                register: './sequelize-integration',
                options: [
                    {
                        name: config.get('/sequelize/database'), // identifier
                        models: './src/models/entity/*.js',  // paths/globs to model files
                        repository: './src/models/repository',  // paths to model files
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
                register: './auth-jwt'
            }
        },
        {
            plugin: {
                register: './jsonapi',
                options: {
                    serializers:'./src/models/serializers/*.js'
                }
            }
        }
    ]
};

module.exports = new Confidence.Store(manifest);
