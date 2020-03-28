const database = require('./database');


async function databasePlugin() {
    await database.open();
};

module.exports = databasePlugin;
