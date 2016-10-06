const internals = module.exports = (route, options) => {

    return function (request, reply) {

        return internals[options.method](request, reply);
    };
};

internals.status = (request, reply) => {

    const pingService = request.server.methods.ping;
    const agent = pingService.logAgent(request.pre.collectAgentInfo);

    return reply({
        name: 'status-service',
        agent
    });
};
