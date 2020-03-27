const FastifyFactory = require('fastify');

const config = require('./config/config').get('server');
const log = require('./util/log');


const pluginPaths = [

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

    log.info('kkthxbai');

    process.exit(0);
});
