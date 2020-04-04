const session = require('../session/session')

let _impl

module.exports = {
  setup (impl) {
    _impl = impl
  },
  isUserOnline (userIdentifier) {
    const token = session.getTokenForUserSession(userIdentifier)

    return _impl.isTokenActive(token)
  },
  async notifyUser (userIdentifier, event, message) {
    const token = session.getTokenForUserSession(userIdentifier)

    const clientID = _impl.getClientIDByToken(token)

    await _impl.sendMessageToClient(clientID, event, message)
  }
}
