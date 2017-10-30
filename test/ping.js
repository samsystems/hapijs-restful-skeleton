const Code = require('code');
const Lab = require('lab');
const mockServer = require('./mocks/server');
const _ = require('lodash');

const lab = exports.lab = Lab.script();
const {experiment, before, after, test} = lab;
const {expect} = Code;

let server;

before((done) => {

    mockServer((obj) => {
        server = obj;
        server.register([{
            register: require('scooter')
        }]);
        const pingService = require('../src/methods/ping');
        _.mapKeys(pingService, (method, key) => {
            server.method('ping.'+ `${key}`, method.method, method.options || {});
        });
        const handlerName = 'ping';
        const handlerFile = require('../src/handlers/ping');
        let handler = new handlerFile(server);
        server.handler(handlerName, handler.dispatch.bind(handler));
        const preHandlers = require('../src/pre-handlers/ping');
        let pres = {};
        pres['ping'] = {};
        _.mapKeys(preHandlers, (preHandler, key) => {
            pres['ping'][key] = {
                method: preHandler,
                assign: key
            };
        });
        server.decorate('server', 'preHandlers', pres);
        server.decorate('request', 'preHandlers', pres);
        server.route({
            method: 'GET',
            path: '/ping',
            handler: { ping: { method: 'status' } },
            config: {
                pre: [
                    server.preHandlers.ping.collectAgentInfo
                ]
            }
        });
        done();
    });
});

after((done) => {
    'use strict';
    server.stop(done);
});

experiment('Get ping call', () => {
    'use strict';

    test('received pong', (done) => {
        server.inject('/ping', (resp) => {
            const pingService = resp.request.server.methods.ping;
            const agent = pingService.logAgent(resp.request.pre.collectAgentInfo);
            expect(resp.statusCode).to.equal(200);
            expect(JSON.parse(resp.payload).agent.status).to.equal('OK');
            expect(JSON.parse(resp.payload).agent).to.equal(agent);
            done();

        });
    });


});
