'use strict';

let twilio = require('twilio');
const config = require('../../core/config');

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
                url: "http://1d171eb6.ngrok.io/twilio/xml", //TODO change for public url
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
            path: '/twilio/token',
            handler: function(request, reply) {
                let capability = new twilio.Capability(options.accountSid, options.authToken);
                capability.allowClientOutgoing(options.twimlAppSid);
                let token = capability.generate();
                reply(token);
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