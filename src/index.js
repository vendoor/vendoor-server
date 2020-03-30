const FastifyFactory = require('fastify')

const config = require('./config/config').get('server')
const log = require('./util/log')
const openapi = require('./openapi/openapi')
const shutdown = require('./shutdown/shutdown')

const pluginPaths = [
  './database/plugin.js',
  './version/plugin.js',
  './healthcheck/plugin.js'
]

const fastify = FastifyFactory({
  logger: log
})

openapi.attach(fastify)

pluginPaths.forEach(path => {
  log.info('Registering plugin: %s', path)

  const plugin = require(path)

  fastify.register(plugin)
})

fastify.listen(config.port, async function onListening (err) {
  if (err) {
    log.error(err)

    await shutdown.requestShutdown('Failed to initialize the server.', 1)
  }

  openapi.activate(fastify)

  shutdown.registerHook('Close fastify.', async () => fastify.close())
})

process.on('SIGTERM', async function sigtermListener () {
  await shutdown.requestShutdown('SIGTERM received', 0)
})
