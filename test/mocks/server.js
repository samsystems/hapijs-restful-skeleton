// import Hapi from 'hapi';
//
// const server = new Hapi.Server();
// server.connection();
//
// server.start(() => done(server));
// module.exports = function(done) {
//     'use strict';
//      server.start(() => done(server));
// };
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();

module.exports = function(done) {
    'use strict';
    server.start(() => done(server));
};
