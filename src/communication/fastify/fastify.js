const FastifyFactory = require('fastify')

const log = require('../../util/log')

let fastify

module.exports = {
  async setup () {
    fastify = FastifyFactory({
      logger: log
    })
  },
  async teardown () {
    await fastify.close()
  },

  instance () {
    return fastify
  }
}
