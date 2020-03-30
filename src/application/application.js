const log = require('../util/log')

const dependencyGraph = require('./dependency-graph')

const components = {}
const orderedComponents = []
const initializedComponents = []
const products = {}

function registerComponent (component) {
  log.info(`Registering component "${component.name}"`)

  components[component.name] = component
}

async function setup () {
  log.info('Setting up the application')

  const orderedComponents = dependencyGraph.resolve(components)

  log.debug(`Component setup order is: ${orderedComponents.map(c => c.name).join(', ')}`)

  for (const component of orderedComponents) {
    if (component.setup) {
      try {
        const result = await component.setup(products)

        products[component.name] = result

        initializedComponents.push(component)
      } catch (err) {
        log.fatal(`Failed to setup component "${component.name}"`)
        console.log(err)

        await teardown(1)
      }
    }
  }
}

async function teardown (status = 0) {
  log.info('Shutting down application')

  const reverseOrderedComponents = [].concat(orderedComponents).reverse()

  log.debug(`Component teardown order is: ${reverseOrderedComponents.map(c => c.name).join(', ')}`)

  for (const component of reverseOrderedComponents) {
    if (component.teardown) {
      try {
        await component.teardown(products, status)
      } catch (e) {
        log.error(`Failed to teadown component "${component.name}"`)
      }

      delete products[component.name]
    }
  }

  log.info('All teardown hooks executed, exiting.')
  log.info('kkthxbai')

  log.flushSync()

  process.exit(status)
}

function getComponentProduct (name) {
  return products[name]
}

module.exports = {
  registerComponent,
  setup,
  teardown,
  getComponentProduct
}
