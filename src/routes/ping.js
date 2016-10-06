module.exports = (server) => {

    server.route([
        {
            method: 'GET',
            path: '/ping',
            config: {
                description: 'Ping to get status of the server.',
                notes: 'Verify if service is online.',
                tags: ['api'],
                pre: [
                    server.preHandlers.ping.collectAgentInfo
                ],
                handler: { ping: { method: 'status' } },
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            200: {
                                description: 'OK: service is online'
                            },
                            404: {
                                description: 'NOT_FOUND: service is not working properly.'
                            },
                            500: {
                                description: 'INTERNAL_SERVER_ERROR: application is complete down.'
                            }
                        }
                    }
                }
            }
        }
    ]);
};
