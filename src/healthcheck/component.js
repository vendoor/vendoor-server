const routePaths = [
  './web/getHealthcheck.js'
]

module.exports = {
  name: 'healthcheck',
  dependencies: ['fastify'],

  async initialize ({ fastify }) {
    routePaths
      .map(require)
      .forEach(route => fastify.route(route))
  }
}
