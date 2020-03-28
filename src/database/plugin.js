const database = require('./database');
const shutdown = require('../shutdown/shutdown');


async function databasePlugin() {
    await database.open();

    shutdown.registerHook(async () => await database.close());
};

module.exports = databasePlugin;
