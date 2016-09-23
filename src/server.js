import Hapi from 'hapi';

const server = new Hapi.Server();

server.connection( {
    port: 8080
});

function sayHello(request, reply) {

    reply({
        hello: request.params.name
    });
}

server.route({

    method: 'GET',
    path: '/hello/{name}',
    handler: sayHello
});

server.start(err => {

    if (err) {

        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );

    }

    console.log( `Server started at ${ server.info.uri }` );

});
