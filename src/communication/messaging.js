const session = require('../session/session')

const impl = require('./comlink/messaging')

module.exports = {
  isUserOnline (userIdentifier) {
    const token = session.getTokenForUserSession(userIdentifier)

    return impl.instance().isTokenActive(token)
  },
  async messageUser (userIdentifier, event, message) {
    const token = session.getTokenForUserSession(userIdentifier)

    const clientID = impl.instance().getClientIDByToken(token)

    await impl.instance().sendMessageToClient(clientID, event, message)
  },
  registerMessageHandler (func) {
    impl.instance().registerMessageHandler(func)
  }
}
