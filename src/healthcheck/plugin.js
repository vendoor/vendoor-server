const routePaths = [
    './web/getHealthcheck.js'
];

async function healthcheckPlugin(fastify) {
    routePaths
        .map(require)
        .forEach(route => fastify.route(route));    
};

module.exports = healthcheckPlugin;
