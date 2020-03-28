const log = require('../util/log');


const NORMAL_SHUTDOWN = 0;
const hooks = [];

function registerHook(description, hook) {
    hooks.push({
        description, hook
    });
};

async function requestShutdown(description, statusCode) {
    if (statusCode != NORMAL_SHUTDOWN) {
        log.fatal(`Shutdown requested: ${description}`);
    } else {
        log.info(`Shutdown requested: ${description}`);
    }

    for (const descriptor of hooks) {
        log.info(`Shutdown Hook - ${descriptor.description}`);
        await descriptor.hook();
    }

    log.info('All shutdown hooks executed, shutting down.');
    log.info('kkthxbai');

    log.flushSync();

    process.exit(statusCode);
};

module.exports = {
    registerHook,
    requestShutdown
};
