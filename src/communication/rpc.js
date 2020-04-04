const log = require('../util/log')

const routeMap = new Map()

async function rpcRouter (path, data, client) {
  const handler = routeMap.get(path)

  if (!handler) {
    log.error('No RPC handler found for path "%s"', path)

    throw new Error('Handler not found for call.')
  }

  const result = await handler.handler(...data, client)

  log.debug('Successfully routed RPC invocation for path "%s"', path)

  return result
}

module.exports = {
  setup (impl) {
    impl.registerRpcRouter(rpcRouter)
  },
  /**
   * Registers a new RPC handler.
   * @param {Object} handlerRegistration Information about the handler being registered.
   * @param {string} handlerRegistration.path The path to attach the handler on. Paths should use the dot notation for namespacing:
   *                                          location.getLocationsForUser
   * @param {function} handlerRegistration.handler The actual handler function. Async function are allowed.
   * @param {Object} [handlerRegistration.schema] JSON schemas for request and response description and validation.
   * @param {Object} [handlerRegistration.schema.request] JSON schema for request description and validation.
   *                                                      Requests violating this schema will be discarded.
   * @param {Object} [handlerRegistration.schema.response] JSON schema for response description and validation.
   *                                                       Responses violating this schema will be discarded.
   * @param {Object} [handlerRegistration.meta] Metainformation about the handler being registered
   * @param {string} [handlerRegistration.meta.title] The title of the handler.
   * @param {string} [handlerRegistration.meta.description] Markdown formatted description of the handler.
   * @param {string[]} [handlerRegistration.meta.tags] Arbitrary string tags.
   */
  registerRpcHandler (handlerRegistration) {
    if (routeMap.has(handlerRegistration.path)) {
      throw new Error(`Path "${handlerRegistration.path}" is already registered by another handler.`)
    }

    routeMap.set(handlerRegistration.path, handlerRegistration)

    log.info('Registered RPC handler for path "%s"', handlerRegistration.path)
  },
  getRpcHandlers () {
    const result = {}

    for (const handler of routeMap.values()) {
      result[handler.path] = handler
    }

    return result
  }
}
