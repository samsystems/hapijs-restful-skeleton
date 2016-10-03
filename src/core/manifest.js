import Confidence from 'confidence';
import config from './config';

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
                register: './index',
                options: {
                    routes: {
                        cwd: `${process.cwd()}/src/routes`,
                        pattern: '**/*.js',
                        glob: {
                            cwd: `${process.cwd()}/src/routes`
                        }
                    },
                    handlers: {
                        cwd: `${process.cwd()}/src/handlers`,
                        pattern: '**/*.js',
                        glob: {
                            cwd: `${process.cwd()}/src/handlers`
                        }
                    },
                    methods: {
                        cwd: `${process.cwd()}/src/methods`,
                        pattern: '**/*.js',
                        glob: {
                            cwd: `${process.cwd()}/src/methods`
                        }
                    },
                    preHandlers: {
                        cwd: `${process.cwd()}/src/pre-handlers`,
                        pattern: '**/*.js',
                        glob: {
                            cwd: `${process.cwd()}/src/pre-handlers`
                        }
                    }
                }
            }
        }
    ]
};

export default new Confidence.Store(manifest);
