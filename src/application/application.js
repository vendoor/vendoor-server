const log = require('../util/log')

const dependencyGraph = require('./dependency-graph')

const components = {}
const orderedComponents = []

function registerComponent (component) {
  log.info(`Registering component "${component.title}"`)

  components[component.name] = component
}

async function start () {
  log.info('Starting application')

  const orderedComponents = dependencyGraph.resolve(Object.values(components))

  log.debug(`Component initialization order is: ${orderedComponents.map(c => c.title).join(', ')}`)

  for (const component of orderedComponents) {
    await component.initialize()
  }
}

async function shutdown () {
  log.info('Shutting down application')

  const reverseOrderedComponents = [].concat(orderedComponents).reverse()

  log.debug(`Component teardown order is: ${reverseOrderedComponents.map(c => c.title).join(', ')}`)

  for (const component of reverseOrderedComponents) {
    await component.teardown()
  }
}

module.exports = {
  registerComponent,
  start,
  shutdown
}
