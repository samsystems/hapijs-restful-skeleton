class BaseHandler {

    constructor (server) {
        this.server = server;
    }

    dispatch (route, options) {
        return this.trigger.bind(this, options.method);
    }

    getService (name) {
        if (this.server.methods[name]) {
            return this.server.methods[name];
        }
    }

    trigger (method, request, reply) {
        this.em = request.getDb();
        return this[method].call(this ,request, reply);
    }
}

module.exports = BaseHandler;
