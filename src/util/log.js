const pino = require('pino');

const config = require('../config/config').get('log');


const log = pino({
    prettyPrint: config.pretty
});

module.exports = log;
