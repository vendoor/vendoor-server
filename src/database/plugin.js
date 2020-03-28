const database = require('./database');
const migration = require('./migration/migration');
const shutdown = require('../shutdown/shutdown');


async function databasePlugin() {
    await database.open();

    shutdown.registerHook(async () => await database.close());

    await migration.checkDatabaseVersion();
};

module.exports = databasePlugin;
