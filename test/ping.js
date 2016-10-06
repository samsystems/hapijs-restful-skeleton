const Code = require('code');
const Lab = require('lab');
const pluginLoad = require('../src/plugins/loader');
const config = require('../src/core/config');
const mockServer = require('./mocks/server');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const before = lab.before;
const after = lab.after;
const it = lab.it;
const expect = Code.expect;

let server;

before((done) => {
    'use strict';

    mockServer(function (obj) {
        server = obj;
        server.register([{
            register: pluginLoad,
            options: config.get('/loader')
        }, {
            register: require('scooter')
        }], done);
    });
});

after((done) => {
    'use strict';
    server.stop(done);
});

describe('Get ping call', function () {
    'use strict';

    it('received pong', function (done) {
        var options = {
            method: 'GET',
            url: '/ping'
        };

        server.inject(options, (resp) => {
            const pingService = resp.request.server.methods.ping;
            const agent = pingService.logAgent(resp.request.pre.collectAgentInfo);

            expect(200).to.equal(200);
            expect(resp.request.response.source).to.equal({
                'name': 'status-service',
                'agent': agent
            });

            done();
        });
    });

});
