const BaseHandler = require('../core/base-handler');

class PingHandler extends BaseHandler {

    status(request, reply) {
        const pingService = this.getService('ping');
        const agent = pingService.logAgent(request.pre.collectAgentInfo);

        return reply({
            name: 'status-service',
            agent
        });
    }
}

module.exports = PingHandler;
