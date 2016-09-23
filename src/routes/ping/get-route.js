
function ping(request, reply) {

    reply({
        pong: new Date()
    });
}

module.exports = {
    method: 'GET',
    path: '/',
    config: {
        description: 'Ping to get status of the server.',
        // ...
    },
    handler: ping
};
