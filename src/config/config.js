const convict = require('convict');


const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development'],
        default: 'production',
        env: 'NODE_ENV'
    },
    log: {
        pretty: {
            doc: 'Whether to output pretty printed logs.',
            format: Boolean,
            default: false
        }
    },
    sever: {
        port: {
            doc: 'The port on which the server will listen.',
            format: 'nat',
            default: 3000,
            env: 'PORT'
        }
    }
});

const env = config.get('env');
config.loadFile(`${__dirname}/../../config/${env}.json`);

config.validate({ allowed: 'strict' });

module.exports = config;
