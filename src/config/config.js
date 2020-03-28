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
    server: {
        port: {
            doc: 'The port on which the server will listen.',
            format: 'nat',
            default: 3000,
            env: 'PORT'
        }
    },
    database: {
        connectionString: {
            doc: 'Connection string to the database.',
            format: String,
            default: 'mongodb://localhost:27017',
            env: 'VENDOOR_DATABASE_CONNECTION_STRING'
        },
        name: {
            doc: 'The name of the database.',
            format: String,
            default: 'vendoor',
            env: 'VENDOOR_DATABASE_NAME'
        }
    }
});

const env = config.get('env');
config.loadFile(`${__dirname}/../../config/${env}.json`);

config.validate({ allowed: 'strict' });

module.exports = config;
