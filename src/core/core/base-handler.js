class BaseHandler {

    constructor(server) {
        this.server = server;
        this.em = server.getDb();
    }

    dispatch(route, options) {
        return this.trigger.bind(this, options.method);
    }

    getService(name) {
        if (this.server.methods[name]) {
            return this.server.methods[name];
        }
    }

    trigger(method, request, reply) {
        return this[method].call(this, request, reply);
    }
}

module.exports = BaseHandler;