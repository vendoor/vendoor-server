const comlink = require('./comlink/comlink')
const config = require('../config/config')
const fastify = require('./fastify/fastify')

module.exports = {
  name: 'communication',
  dependencies: ['database'],

  async setup () {
    await fastify.setup()

    await comlink.setup(fastify.instance().server)

    return {
      fastify: fastify.instance(),
      rpc: require('./rpc'),
      messaging: require('./messaging'),
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
