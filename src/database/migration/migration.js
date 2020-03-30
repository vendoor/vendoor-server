const config = require('../../config/config')
const database = require('../database')
const log = require('../../util/log')
const shutdown = require('../../shutdown/shutdown')

async function retrieveActualVersion () {
  const migrationCollection = database.instance().collection('Migration')

  const filter = {}
  const options = {
    sort: {
      timestamp: -1
    }
  }

  const latestMigrationDocument = await migrationCollection.findOne(filter, options)

  return (latestMigrationDocument ? latestMigrationDocument.version : null)
};

async function checkDatabaseVersion () {
  const requiredVersion = config.get('database.requiredVersion')

  log.info(`Checking if database is migrated to version ${requiredVersion}`)

  const actualVersion = await retrieveActualVersion()

  log.info(`Actual database version is ${actualVersion}`)

  if (requiredVersion !== actualVersion) {
    await shutdown.requestShutdown(`Actual database version is ${actualVersion}, expected is ${requiredVersion}`, 1)
  }
};

module.exports = {
  checkDatabaseVersion
}
