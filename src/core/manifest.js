const Confidence = require('confidence');
const config = require('./config');

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
        host: config.get('/host/api'),
        port: config.get('/port/api'),
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
                register: './sequelize-integration',
                options: [
                    {
                        name: config.get('/sequelize/database'), // identifier
                        models: ['./src/models/*.js'],  // paths/globs to model files
                        config: config.get('/sequelize'), // sequelize config
                        sync: true, // sync models - default false
                        forceSync: true // force sync (drops tables) - default false
                    }
                ]
            },
        },
        {
            plugin: {
                register: './loader',
                options: config.get('/loader')
            }
        }
    ]
};

module.exports = new Confidence.Store(manifest);
