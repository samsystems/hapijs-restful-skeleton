class BaseHandler {

    constructor(server) {
        this.server = server;
        this.serializer = '';
        this.model = null;
        this.relatedEntities = null;
        this.service = this.getService('crud');
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

    list(request, reply) {
        let resp = this.service.list(request.db.getModel(this.model), request.query,
            request.db.getRelatedEntities(this.relatedEntities));
        reply.serialize(this.serializer, resp, { total: 'count', data: 'rows'});
    }

    findOne(request, reply) {
        let resp = this.service.findOne(request.db.getModel(this.model), request.params.id,
            request.db.getRelatedEntities(this.relatedEntities));
        reply.serialize(this.serializer, resp);
    }

    create(request, reply) {
        if(request.headers.accept === 'application/vnd.api+json') {
            request.deserializePayload(this.serializer, (errs, payload) => {
                let resp = this.service.create(request.db.getModel(this.model), payload,
                    request.db.getRelatedEntities(this.relatedEntities));
                reply.serialize(this.serializer, resp);
            });
        }
        else {
            let resp = this.service.create(request.db.getModel(this.model), request.payload,
                request.db.getRelatedEntities(this.relatedEntities));
            reply(resp);
        }
    }

    update(request, reply) {
        if(request.headers.accept === 'application/vnd.api+json') {
            reply.serialize(this.serializer, this.service.update(request.db.getModel(this.model),
                request.params.id, request.payload.data.attributes));
        }
        else {
            reply(this.service.update(request.db.getModel(this.model), request.params.id, request.payload));
        }
    }

    delete(request, reply) {
        let resp = this.service.delete(request.db.getModel(this.model), request.params.id);
        reply(resp);
    }
}

module.exports = BaseHandler;