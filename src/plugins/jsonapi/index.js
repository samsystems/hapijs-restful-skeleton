const internals = {};
const _ = require('lodash');
const Exception = require('../../core/error/base');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const Path = require('path');
const Glob = require('glob');

const serializerStore = {};
const deserializerStore = {};

internals.getSerializer = (type) => {
    return _.get(serializerStore, type);
};

internals.deserialize = function (type, callback) {
    return _.get(deserializerStore, type).deserialize(this.payload, callback);
};

internals.getFiles = (paths, ignored) => {
    return new Promise((resolve) => {
        const opts = {
            nodir: true,
            dot: false
        };

        if (!Array.isArray(paths)) paths = [paths];
        if (ignored) opts.ignore = ignored;

        return resolve(paths.reduce((acc, pattern) => {
            const joinPaths = Array.prototype.concat.bind([], acc);
            const paths = Glob.sync(pattern, opts);
            return joinPaths(paths);
        }, []));
    });
};

internals.loadSerializer = (files, fn) => {

    if (!files) return resolve([]);
    if (!Array.isArray(files)) files = [files];

    _.map(files, (file) => {
        const filepath = Path.isAbsolute(file) ? file : Path.join(process.cwd(), file);
        const serializer = require(filepath);
        const type = _.get(serializer, 'register.type');
        const options = _.get(serializer, 'register.options');
        _.set(serializerStore, type, new JSONAPISerializer(type, options));
        internals.loadDeserializer(type, options);
        fn(type);
    });
};

internals.loadDeserializer = (name, options) => {
    const attributes = _.get(options, 'attributes', {});
    let config = {keyForAttribute: 'camelCase'};
    for (let i in attributes) {
        const index = attributes[i];
        if (_.get(options, index) && _.get(options, `${index}.valueForRelationship`, false)) {
            config[index] = {
                valueForRelationship: _.get(options, `${index}.valueForRelationship`)
            }
        }
    }
    _.set(deserializerStore, name, new JSONAPIDeserializer(config));
};

internals.validHeaders = (headers) => {
    let mediaTypes = 'application/vnd.api+json';
    if (headers['accept'] && headers['content-type']) {
        let arrAccept = headers['accept'].split(',');
        let arrContentTypes = headers['content-type'].split(',');
        if (_.indexOf(arrAccept, mediaTypes) != -1 && _.indexOf(arrContentTypes, mediaTypes) != -1) {
            return true;
        }
    }
    return false;
};

internals.extractDataToSerialize = (source, config) => {
    let data = _.get(source, config.data, source);
    return _.isArray(data)
        ? data.reduce((arr, next) => {
            arr.push(JSON.parse(JSON.stringify(next)));
            return arr;
        }, [])
        : JSON.parse(JSON.stringify(data));
};

internals.onPreResponse = (request, reply) => {
    let response = request.response;
    let serializer = _.get(response, 'jsonapi.serializer', false);
    if (!response.isBoom && internals.validHeaders(request.headers) && serializer) {
        const sourceData = internals.extractDataToSerialize(response.source, response.jsonapi);
        const dataSerialized = internals.getSerializer(serializer)
            .serialize(sourceData);

        let links = {
            self: request.connection.info.uri + request.path
        };

        const limit = _.get(request.query, 'page[size]', false);
        const page = _.get(request.query, 'page[number]', false);
        const realCount = dataSerialized.data.length;

        if (limit && page) {
            const totalRecords = _.get(response.source, response.jsonapi.totalRecords, 0);
            let cantPages = totalRecords / limit;
            cantPages = cantPages > parseInt(cantPages) ? cantPages + 1 : cantPages;
            links.first = request.connection.info.uri + request.path + `?page[size]=${limit},page[number]=1`;

            if (page > 1) {
                const prevPage = page - 1;
                links.prev = request.connection.info.uri + request.path + `?page[size]=${limit},page[number]=${prevPage}`;
            }
            if (page + 1 <= cantPages) {
                const nextPage = page + 1;
                links.next = request.connection.info.uri + request.path + `?page[size]=${limit},page[number]=${nextPage}`;
            }

            if (totalRecords > realCount) {
                links.last = request.connection.info.uri + request.path + `?page[size]=${limit},page[number]=${cantPages}`;
            }
            dataSerialized.meta = {total: totalRecords};
        }
        dataSerialized.links = links;

        return reply.continue(dataSerialized);
    }
    return reply.continue();
};

internals.decorateResponseToSerialize = () => {
    return true;
};

internals.register = module.exports = (server, options, next) => {

    if (options.serializers) {
        internals.getFiles(options.serializers)
            .then((files) => {
                internals.loadSerializer(files, (serializerName) => {
                    server.log(['info', 'registerSerializer'], `registered ${serializerName} serializer`);
                });
            });
        server.decorate('request', 'getSerializer', internals.getSerializer);
        server.decorate('request', 'deserializePayload', internals.deserialize);
    }

    server.ext('onPreResponse', internals.onPreResponse);

    server.decorate('reply', 'serialize', function (serializer, response, format = {}) {
        let genaratedResponse = this.response(response);

        genaratedResponse['jsonapi'] = {
            serializer: serializer,
            data: _.get(format, 'data', null),
            totalRecords: _.get(format, 'total')
        };
    });

    return next();
};

internals.register.attributes = {
    name: 'jsonapi'
};