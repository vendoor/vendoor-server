const log = require('../util/log');


const hooks = [];

function registerHook(hook) {
    hooks.push(hook);
};

async function requestShutdown(description, statusCode) {
    log.info(`Shutdown requested: ${description}`);

    for (const hooks of hooks) {
        await hook();
    }

    log.info('All shutdown hooks executed, shutting down.');
    log.info('kkthxbai');

    process.exit(statusCode);
};

module.exports = {
    registerHook,
    requestShutdown
};
