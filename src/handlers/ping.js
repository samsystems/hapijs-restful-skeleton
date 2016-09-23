const internals = module.exports = (route, options) => {

    return (request, reply) => {

        return internals[options.method](request, reply);
    };
};

internals.ping = (request, reply) => {

    reply({
        pong: new Date()
    });
};
