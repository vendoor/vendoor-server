const impl = require('./comlink/messaging')

module.exports = {
  registerMessageHandler (func) {
    impl.instance().registerMessageHandler(func)
  },
  isUserOnline (token) {
    impl.instance().isTokenActive(token)
  },
  notifyUser (token, event, message) {
    const clientID = impl.instance().getClientIDByToken(token)

    impl.instance().sendMessageToClient(clientID, event, message)
  },
  registerRpcHandler (path, func) {
    impl.instance().registerRpcHandler(path, func)
  }
}
