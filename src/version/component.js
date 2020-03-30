const config = require('../config/config')
const log = require('../util/log')
const versionConfig = require('./config/config')

const routePaths = [
  './web/getVersion.js'
]

module.exports = {
  name: 'version',
  dependencies: ['fastify'],

  async initialize ({ fastify }) {
    versionConfig.configureVersion(config)

    log.info(`Deployed application version is ${config.get('version.pretty')}`)

    routePaths
      .map(require)
      .forEach(route => fastify.route(route))
  }
}
