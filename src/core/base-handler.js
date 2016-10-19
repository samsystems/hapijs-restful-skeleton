class BaseHandler {

    constructor(server) {
        this.server = server;
    }

    dispatch(route, options) {
        this.route = route;
        this.options = options;
        return this.trigger.bind(this);
    }

    getService(name) {
        if (this.server.methods[name]) {
            return this.server.methods[name];
        }
    }

    trigger(request, reply) {
        return this[this.options.method].call(this ,request, reply);
    }
}
module.exports = BaseHandler;