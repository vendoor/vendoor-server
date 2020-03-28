const FastifyFactory = require('fastify');

const config = require('./config/config').get('server');
const log = require('./util/log');
const shutdown = require('./shutdown/shutdown');


const pluginPaths = [
    './database/plugin.js'
];

const fastify = FastifyFactory({
    logger: log
});

pluginPaths.forEach(path => {
    log.info("Registering plugin: %s", path);

    const plugin = require(path);

    fastify.register(plugin);
});

fastify.listen(config.port, async function onListening(err) {
    if (err) {
        log.error(err)

        await shutdown.requestShutdown('Failed to initialize the server.', 1);
    }

    shutdown.registerHook('Close fastify.', async () => await fastify.close());
});

process.on('SIGTERM', async function sigtermListener() {
    await shutdown.requestShutdown('SIGTERM received', 0);
});
