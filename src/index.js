// import Hapi from 'hapi';
//
// const server = new Hapi.Server();
//
// server.connection( {
//     port: 8080
// });

const run = require('./core');
const Glob = require('glob');

run((err, server) => {

    if (err) {
        throw err;
    }

    // Require routes.
    Glob.sync('**/*route*.js', { cwd: __dirname }).forEach(function (ith) {

        const route = require('./' + ith);
        if (route.hasOwnProperty('method') && route.hasOwnProperty('path')) {

            console.log('Adding route:', route.method, route.path);
            server.route(route);
        }
    });

    server.start(err => {

        if (err) {

            // Fancy error handling here
            console.error( 'Error was handled!' );
            console.error( err );

        }

        console.log( `Server started at ${ server.info.uri }` );

    });

});
