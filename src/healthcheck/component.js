const routePaths = [
  './web/getHealthcheck.js'
]

module.exports = {
  name: 'healthcheck',
  dependencies: ['communication'],

  async setup ({ communication }) {
    routePaths
      .map(require)
      .forEach(route => communication.fastify.route(route))
  }
}
