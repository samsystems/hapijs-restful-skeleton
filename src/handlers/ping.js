const internals = module.exports = (route, options) => {

    return function (request, reply) {

        return internals[options.method](request, reply);
    };
};

internals.status = (request, reply) => {

    const pingService = request.server.methods.ping;
    const agent = pingService.logAgent(request.pre.collectAgentInfo);

    return reply({
        updated: new Date(),
        name: 'status-service',
        agent
    });
};
