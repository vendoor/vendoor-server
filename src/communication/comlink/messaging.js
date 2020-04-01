const WebSocket = require('ws')

const authentication = require('../../security/authentication/authentication')
const session = require('../../session/session')
const log = require('../../util/log')

let _comlink
let ws

let messageHandler

async function clientFromRequest (message) {
  const sessionData = await session.getSessionForToken(message._token)

  return {
    identifier: message._clientID,
    token: message._token,
    session: sessionData
  }
}

function registerMessageHandler (func) {
  messageHandler = func
}

function tokenValidator (token) {
  return authentication.validateToken(token)
}

const CHANNEL_NAME = 'Messaging'

module.exports = {
  async setup (comlink) {
    _comlink = comlink

    ws = new WebSocket.Server({
      noServer: true
    })

    comlink.registerDialect({
      name: 'message',
      interface: {
        sendTo: '',
        message: ''
      },
      async onRequest (request) {
        const client = await clientFromRequest(request)

        log.debug('Extracted client from Messaging request %o', client)

        return messageHandler(request.sendTo, request.message, client)
      }
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

  instance () {
    return {
      registerMessageHandler,
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
  }
}
