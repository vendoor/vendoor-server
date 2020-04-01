const convict = require('convict')

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
    },
    requiredVersion: {
      doc: 'The required migration version of the database.',
      format: String,
      default: '1.0.0',
      env: 'VENDOOR_DATABASE_REQUIRED_VERSION'
    }
  },
  version: {
    branch: {
      doc: 'The git branch of the current version.',
      format: String,
      default: 'unknown'
    },
    hash: {
      doc: 'The git commit hash of the current version.',
      format: String,
      default: 'unknown'
    },
    semver: {
      doc: 'The actual semver version of the current version.',
      format: String,
      default: 'unknown'
    },
    pretty: {
      doc: 'Preformatted string version of the version data.',
      format: String,
      default: 'unknown-unknown-unknown'
    }
  }
})

const env = config.get('env')
config.loadFile(`${__dirname}/../../config/${env}.json`)

config.validate({ allowed: 'strict' })

module.exports = config
