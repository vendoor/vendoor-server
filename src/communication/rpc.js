const Ajv = require('ajv')
const fastJson = require('fast-json-stringify')

const copy = require('../util/copy')
const log = require('../util/log')

const ajv = Ajv({
  allErrors: true
})

const internalRouteMap = new Map()
const publicRouteMap = new Map()

async function handleRpcInvocation (handler, data, client) {
  log.debug('Validating schema on path "%s"', handler.path)
  const isRequestValid = handler.requestValidator(data)

  if (!isRequestValid) {
    log.debug('Invalid request on path: %o', handler.requestValidator.errors)

    return {
      errors: handler.requestValidator.errors
    }
  }

  const response = await handler.handler(...data, client)

  log.debug('Stringifying result on path "%s"', handler.path)
  return handler.responseStringifier(response)
}

function routeRpcInvocation (path, data, client) {
  const handler = internalRouteMap.get(path)

  if (!handler) {
    log.error('No RPC handler found for path "%s"', path)

    throw new Error('Handler not found for call.')
  }

  log.debug('Handler found for RPC invocation with path "%s"', path)

  return handleRpcInvocation(handler, data, client)
}

function makePublicHandlerRegistration (handlerRegistration) {
  return {
    path: handlerRegistration.path,
    schema: copy.deep(handlerRegistration.schema),
    meta: copy.deep(handlerRegistration.meta)
  }
}

function defaultRequestValidator () {
  return true
}

function defaultResponseStringifier (obj) {
  return JSON.stringify(obj)
}

function initializeInternalHandler (handlerRegistration) {
  const internalRegistrationObject = copy.deep(handlerRegistration)

  if (handlerRegistration.schema && handlerRegistration.schema.request) {
    // The .errors property will be shared, but this will not cause problems for us.
    // (see the ajv docs on usage)
    internalRegistrationObject.requestValidator = ajv.compile(handlerRegistration.schema.request)
  } else {
    internalRegistrationObject.requestValidator = defaultRequestValidator
  }

  if (handlerRegistration.schema && handlerRegistration.schema.response) {
    internalRegistrationObject.responseStringifier = fastJson(handlerRegistration.schema.response)
  } else {
    internalRegistrationObject.responseStringifier = defaultResponseStringifier
  }

  return internalRegistrationObject
}

module.exports = {
  setup (impl) {
    impl.registerRpcRouter(routeRpcInvocation)
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
    if (internalRouteMap.has(handlerRegistration.path)) {
      throw new Error(`Path "${handlerRegistration.path}" is already registered by another handler.`)
    }

    internalRouteMap.set(handlerRegistration.path, initializeInternalHandler(handlerRegistration))
    publicRouteMap.set(handlerRegistration.path, makePublicHandlerRegistration(handlerRegistration))

    log.info('Registered RPC handler for path "%s"', handlerRegistration.path)
  },
  getRpcHandlers () {
    const result = {}

    for (const handler of publicRouteMap.values()) {
      result[handler.path] = handler
    }

    return result
  }
}
