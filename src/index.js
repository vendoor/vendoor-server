const application = require('./application/application')
const log = require('./util/log')

const componentPaths = [
  './communication/component.js',
  './database/component.js',
  './fastify/component.js',
  './healthcheck/component.js',
  './version/component.js'
]

componentPaths
  .map(require)
  .forEach(component => application.registerComponent(component))

process.on('SIGTERM', async function sigtermListener () {
  await application.teardown()
});

(async function main () {
  await application.setup()

  const communication = application.getComponentProduct('communication')

  try {
    await communication.listen()
  } catch (err) {
    log.error(err)

    await application.teardown(1)
  }
})()
