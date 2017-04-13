'use strict';

const twilio = require('twilio');
const AccessToken = twilio.AccessToken;
const BadRequestException = require('../../core/error/bad-request-exception');

let twilioIntegration = {
    register: function (server, options, next) {
        let client = require('twilio')(options.accountSid, options.authToken);
        server.method('sendSMS', function(to, from, text){
            client.messages.create({
                to: to,
                from: from,
                body: text,
            }, function(err, message) {
                console.log(message.sid);
            });
        });
        server.method('createCall', function(to, from){
            client.calls.create({
                url: "http://af9a23ac.ngrok.io/twilio/xml", //TODO change for public url
                to: to,
                from: from
            }, function(err, call) {
                console.log(call.sid);
            });
        });

        server.route({
           method: 'GET',
           path: '/twilio/xml/',
           handler: function(request, reply) {
               let xml = "<Response><Dial callerId='"+request.query.From+"'>"+request.query.To+"</Dial></Response>";
               reply(xml).header('Content-type', 'application/xml');
           }
        });

        server.route({
            method: 'GET',
            path: '/twilio/token/call',
            handler: function(request, reply) {
                let capability = new twilio.Capability(options.accountSid, options.authToken);
                capability.allowClientOutgoing(options.twimlAppSid);
                let token = {
                    token: capability.generate()
                };
                reply(token);
            }
        });
        /**
         * Return a correct token
         * */
        server.route({
            method: 'GET',
            path: '/twilio/token/video',
            handler: function(request, reply) {
                const {identity} = request.query;
                if(identity) {
                    let accessToken = new AccessToken(
                        options.accountSid,
                        options.twilioAPIKey,
                        options.twilioAPIKeySecret
                    );
                    accessToken.identity = identity;
                    let grant = new AccessToken.VideoGrant();
                    grant.configurationProfileSid = options.applicationSid;
                    accessToken.addGrant(grant);
                    let token = {
                        token: accessToken.toJwt()
                    };
                    reply(token);
                }
                else {
                    throw new BadRequestException('The identity params is required');
                }
            }
        });
        next();
    }
};

twilioIntegration.register.attributes = {
    name: 'Twilio Integration',
    version: '1.0.0'
};

module.exports = twilioIntegration;