const impl = require('./comlink/rpc')

module.exports = {
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
    impl.instance().registerRpcHandler(path, handler)
  }
}
