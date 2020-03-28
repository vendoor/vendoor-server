const routePaths = [
    './web/getVersion.js'
];

async function versionPlugin(fastify) {
    routePaths
        .map(require)
        .forEach(route => fastify.route(route));    
};

module.exports = versionPlugin;
