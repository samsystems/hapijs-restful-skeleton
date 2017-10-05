const MongoClient = require('mongodb').MongoClient
    , internals = {};

internals.register = module.exports = (server, options, next) => {
    server.decorate('request', 'mongo', function(request) {
        MongoClient.connect("mongodb://" + options.host + ":" + options.port + "/" + options.database, (err, db) => {
            if(!err) {
                request.db = db;
            }
            else {
                throw new Error(err);
            }
        })
    }, {apply: true});
    next();
};

internals.register.attributes = {
    name: "MongoDB decorators"
};