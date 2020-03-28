const pino = require('pino');

const config = require('../config/config').get('log');


const destination = pino.destination(1);

const log = pino({
    prettyPrint: config.pretty
}, destination);

log.flushSync = function flushSync() {
    // Flushing is done as suggested by mcollina
    // https://github.com/pinojs/pino/issues/542#issuecomment-437289512
    destination.flushSync();
};

module.exports = log;
