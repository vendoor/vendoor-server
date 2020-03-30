const log = require('../util/log')

const dependencyGraph = require('./dependency-graph')

const components = {}
const orderedComponents = []
const products = {}

function registerComponent (component) {
  log.info(`Registering component "${component.name}"`)

  components[component.name] = component
}

async function initialize () {
  log.info('Initializing application')

  const orderedComponents = dependencyGraph.resolve(components)

  log.debug(`Component initialization order is: ${orderedComponents.map(c => c.name).join(', ')}`)

  for (const component of orderedComponents) {
    if (component.initialize) {
      const result = await component.initialize(products)

      products[component.name] = result
    }
  }
}

async function teardown () {
  log.info('Shutting down application')

  const reverseOrderedComponents = [].concat(orderedComponents).reverse()

  log.debug(`Component teardown order is: ${reverseOrderedComponents.map(c => c.name).join(', ')}`)

  for (const component of reverseOrderedComponents) {
    if (component.teardown) {
      await component.teardown(products)

      delete products[component.name]
    }
  }
}

function getComponentProduct (name) {
  return products[name]
}

module.exports = {
  registerComponent,
  initialize,
  teardown,
  getComponentProduct
}
