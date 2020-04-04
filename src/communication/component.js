const comlink = require('./comlink/comlink')
const config = require('../config/config')
const fastify = require('./fastify/fastify')

module.exports = {
  name: 'communication',
  dependencies: ['database'],

  async setup () {
    await fastify.setup()

    await comlink.setup(fastify.instance().server)

    const rpc = require('./rpc')
    rpc.setup(comlink.rpc())

    const messaging = require('./messaging')
    messaging.setup(comlink.messaging())
    
    const notification = require('./notification')
    notification.setup(comlink.notification())

    return {
      fastify: fastify.instance(),
      rpc,
      messaging,
      listen
    }

    async function listen () {
      await fastify.instance().listen(config.get('server.port'))
    }
  },
  async teardown () {
    await comlink.teardown()
    await fastify.teardown()
  }
}
