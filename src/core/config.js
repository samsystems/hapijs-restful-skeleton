const Confidence = require('confidence');

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
    },
    sequelize: {
        host: `${process.env.DB_HOSTNAME}`,
        port:`${process.env.DB_PORT}` || 3306,
        database: `${process.env.DB_NAME}`,
        username: `${process.env.DB_USER}`,
        password: `${process.env.DB_PASSWORD}`,
        dialect: `${process.env.DB_DIALECT}`
    },

    twilio: {
        accountSid: 'AC982b367cfe819ea34872dda6f1c4d78c',
        authToken: 'f562587b367c7ca0e7e22751fec69ed3',
        twimlAppSid: 'APc58bd3bc65c8bca5e6314a184c183b59',
        applicationSid: 'VS3c2f14ba85b9adde5de1c37d517f0a6c',
        twilioAPIKey: 'SKb1e745909da4731de575766da49e28eb',
        twilioAPIKeySecret: 'Ki0cNnsWPlervNFuN7x3PPYg26W7crw8',
    },

    plivo: {
        authId: "MAYJA2ZTMZMTUZOTC5MZ",
        authToken: "NzM3ZWU4MGEzNTRlMjU3MzEwN2Q1YmNjMGRlYzFi",
        from: "13059022004"
    },

    mongo: {
        host: `${process.env.MONGO_SERVER}`,
        port: `${process.env.MONGO_PORT}`,
        database: `${process.env.MONGO_DB}`
    }
};

module.exports = new Confidence.Store(config);
