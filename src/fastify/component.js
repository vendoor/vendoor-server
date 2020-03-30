const FastifyFactory = require('fastify')
const log = require('../util/log')

let fastify

module.exports = {
  name: 'fastify',
  dependencies: ['database'],

  async initialize () {
    fastify = FastifyFactory({
      logger: log
    })

    return fastify
  },
  async teardown () {
    await fastify.close()
  }
}
