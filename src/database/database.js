const mongodb = require('mongodb');

const config = require('../config/config').get('database');
const log = require('../util/log');


let client;
let database;

async function open() {
    log.info('Opening and loading database.');

    client = new mongodb.MongoClient(config.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();

    database = client.db(config.name);
};

async function close() {
    log.info('Closing database');

    await client.close();
};

module.exports = {
    open,
    close,
    instance: () => database
};
