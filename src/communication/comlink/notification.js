const WebSocket = require('ws')

const authentication = require('../../security/authentication/authentication')

let _comlink
let ws

function tokenValidator (token) {
  return authentication.validateToken(token)
}

const CHANNEL_NAME = 'Notification'

module.exports = {
  async setup (comlink) {
    _comlink = comlink

    ws = new WebSocket.Server({
      noServer: true
    })

    comlink.registerChannel({
      type: 'ws',
      name: CHANNEL_NAME,
      dialects: [],

      auth: true,
      tokenValidator
    })

    comlink.applyChannel(CHANNEL_NAME, ws)

    return {
      path: `/${CHANNEL_NAME}`,
      ws
    }
  },
  async teardown () {
    ws.close()
  },

  sendMessageToClient (clientID, event, message) {
    return _comlink.sendMessageToClient(CHANNEL_NAME, clientID, event, message)
  },
  getClientIDByToken (token) {
    return _comlink.getClientIDByToken(CHANNEL_NAME, token)
  },
  getTokenByClientID (clientID) {
    return _comlink.getTokenByClientID(CHANNEL_NAME, clientID)
  },
  isTokenActive (token) {
    return _comlink.isTokenActive(CHANNEL_NAME, token)
  },
  isClientActive (clientID) {
    return _comlink.isClientActive(CHANNEL_NAME, clientID)
  }
}
