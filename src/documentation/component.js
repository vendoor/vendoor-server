const routePaths = [
  './web/getRpcHandlers.js'
]

module.exports = {
  name: 'documentation',
  dependencies: ['communication'],

  async setup ({ communication }) {
    routePaths
      .map(require)
      .forEach(route => communication.fastify.route(route))
  }
}
