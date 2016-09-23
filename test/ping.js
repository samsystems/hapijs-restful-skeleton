var Code = require('code');
var Lab = require('lab');
var ping = require('../src/index');
var mockServer = require('./mocks/server');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var before = lab.before;
var after = lab.after;
var it = lab.it;
var expect = Code.expect;

var server;

before((done) => {
    'use strict';
    mockServer(function(obj) {
        server = obj;
        server.register([{
            register: ping
        }], done);
    });
});

after((done) => {
    'use strict';
    server.stop(done);
});

describe('Get ping call', function() {
    'use strict';

    it('received pong', function(done) {
        var options = {
            method: 'GET',
            url: '/'
        };

        server.inject(options, (resp) => {
            expect(resp.statusCode).to.equal(200);
            expect(resp.request.response.source).to.deep.equal({
                pong: new Date()
            });

            done();
        });
    });

});
