import Hapi from 'hapi';

const server = new Hapi.Server();

server.connection( {
    port: 8080
});

function ping(request, reply) {

    reply({
        pong: new Date()
    });
}

server.route({

    method: 'GET',
    path: '/',
    handler: ping
});

server.start(err => {

    if (err) {

        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );

    }

    console.log( `Server started at ${ server.info.uri }` );

});
