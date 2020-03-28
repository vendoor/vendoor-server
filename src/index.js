const FastifyFactory = require('fastify');

const config = require('./config/config').get('server');
const database = require('./database/database');
const log = require('./util/log');


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

fastify.listen(config.port, function onListening(err) {
    if (err) {
        log.error(err)

        process.exit(1)
    }
});

process.on('SIGTERM', async function sigtermListener() {
    log.info('Shutting down.');

    await fastify.close();
    await database.close();

    log.info('kkthxbai');

    process.exit(0);
});
