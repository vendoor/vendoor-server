const session = require('../session/session')

const impl = require('./comlink/notification')

module.exports = {
  isUserOnline (userIdentifier) {
    const token = session.getTokenForUserSession(userIdentifier)

    return impl.instance().isTokenActive(token)
  },
  async notifyUser (userIdentifier, event, message) {
    const token = session.getTokenForUserSession(userIdentifier)

    const clientID = impl.instance().getClientIDByToken(token)

    await impl.instance().sendMessageToClient(clientID, event, message)
  }
}
