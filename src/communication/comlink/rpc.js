const WebSocket = require('ws')

const authentication = require('../../security/authentication/authentication')
const session = require('../../session/session')
const log = require('../../util/log')

let ws

const rpcRouteMapping = {}

function registerRpcHandler (path, func) {
  log.info(`Registering RPC handler for path "${path}"`)

  rpcRouteMapping[path] = func
}

async function routeRpcCall (path, data, client) {
  const func = rpcRouteMapping[path]

  if (!func) {
    // Log and throw is definitely an antipattern, however not in this case.
    //   - We log, so that it's apparent in the server logs that someone is trying to
    //     make this call
    //   - We throw to inform the client that an error happened (exceptions are caught by comlink).
    log.error(`No RPC function found for path "${path}"`)

    throw new Error('Handler not found for call.')
  }

  return func(...data, client)
}

function tokenValidator (token) {
  return authentication.validateToken(token)
}

async function clientFromRequest (message) {
  const sessionData = await session.getSessionForToken(message._token)

  return {
    identifier: message._clientID,
    token: message._token,
    session: sessionData
  }
}

async function onRpcRequest (request) {
  const client = await clientFromRequest(request)

  return routeRpcCall(request.path, request.data, client)
}

const CHANNEL_NAME = 'Communicator'

module.exports = {
  async setup (comlink, server) {
    ws = new WebSocket.Server({
      noServer: true
    })

    comlink.registerDialect({
      name: 'call',
      interface: {
        path: '',
        data: ''
      },
      onRequest: onRpcRequest
    })

    comlink.registerChannel({
      type: 'ws',
      name: CHANNEL_NAME,
      dialects: ['call'],

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
      registerRpcHandler
    }
  }
}
