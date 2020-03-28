const oas = require('fastify-oas');

const config = require('../config/config');
const log = require('../util/log');


const PREFIX = '/documentation';

function attach(fastify) {
    if (config.get('env') != 'development') {
        return
    }

    log.info(`OpenAPI docs will be served at ${PREFIX}`);

    fastify.register(oas, {
        routePrefix: PREFIX,
        swagger: {
            info: {
                title: 'Vendoor API',
                description: 'Vendoor API documentation.',
                version: config.get('version.pretty'),
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here.',
            },
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        exposeRoute: true
    });
};

function activate(fastify) {
    if (config.get('env') != 'development') {
        return
    }

    fastify.oas();
};

module.exports = {
    attach,
    activate
};
