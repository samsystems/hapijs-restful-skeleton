const run = require('./src/core/index');

run((err, server) => {

    if (err) {
        throw err;
    }

    server.start(err => {

        if (err) {

            // Fancy error handling here
            server.log(['error', err], 'Error was handled!');
        }

        const connection = server.select(['api']);
        const info = require('./package.json');

        server.log(['info', info.name], `started at: ${connection.info.uri}`);

    });

});
