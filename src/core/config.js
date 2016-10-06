const Confidence = require('confidence');

const criteria = {
    env: process.env.NODE_ENV
};

const config = {
    $meta: 'This file configures this project.',
    projectName: require('../../package').name,
    host: {
        api: {
            $filter: 'env',
            production: '0.0.0.0',
            $default: '0.0.0.0'
        }
    },
    port: {
        api: {
            $filter: 'env',
            test: 8080,
            $default: 8080
        }
    },
    good: {
        reporters: {
            $filter: 'env',
            $default: {
                console: [
                    {
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{log: '*', response: '*'}]
                    },
                    {
                        module: 'good-console'
                    },
                    'stdout'
                ]
            },
            production: {
                file: [
                    {
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{ops: '*'}]
                    },
                    {
                        module: 'good-squeeze',
                        name: 'SafeJson'
                    },
                    {
                        module: 'good-file',
                        args: [process.cwd() + '/logs/log.json']
                    }
                ]
            }
        }
    },
    loader: {
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
};

module.exports = new Confidence.Store(config);
