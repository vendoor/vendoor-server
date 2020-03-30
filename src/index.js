const application = require('./application/application')
const config = require('./config/config')
const log = require('./util/log')

const componentPaths = [
  './database/component.js',
  './fastify/component.js',
  './healthcheck/component.js',
  './version/component.js'
]

componentPaths
  .map(require)
  .forEach(component => application.registerComponent(component))

process.on('SIGTERM', async function sigtermListener () {
  await application.teardown('SIGTERM received', 0)
});

(async function main () {
  await application.setup()

  const fastify = application.getComponentProduct('fastify')

  fastify.listen(config.get('server.port'), async function onListening (err) {
    if (err) {
      log.error(err)

      await application.teardown('Failed to start the server.', 1)
    }
  })
})()
