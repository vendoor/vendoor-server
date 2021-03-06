const database = require('./database')
const migration = require('./migration/migration')

module.exports = {
  name: 'database',
  dependencies: [],

  async setup () {
    await database.open()

    await migration.checkDatabaseVersion()
  },
  async teardown () {
    await database.close()
  }
}
