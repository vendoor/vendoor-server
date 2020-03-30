const config = require('../config/config')
const log = require('../util/log')
const versionConfig = require('./config/config')

const routePaths = [
  './web/getVersion.js'
]

async function versionPlugin (fastify) {
  versionConfig.configureVersion(config)

  log.info(`Deployed application version is ${config.get('version.pretty')}`)

  routePaths
    .map(require)
    .forEach(route => fastify.route(route))
};

module.exports = versionPlugin
