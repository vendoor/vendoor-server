const WebSocket = require('ws')

const authentication = require('../../security/authentication/authentication')
const session = require('../../session/session')
const log = require('../../util/log')

let ws

let rpcRouter = null

function registerRpcRouter (routerFunc) {
  log.info('Registering RPC router')

  rpcRouter = routerFunc
}

function routeRpcCall (path, data, client) {
  log.debug('Received RPC invocation on path %s', path)

  if (!rpcRouter) {
    // Log and throw is definitely an antipattern, however not in this case.
    //   - We log, so that it's apparent in the server logs that someone is trying to
    //     make this call
    //   - We throw to inform the client that an error happened (exceptions are caught by comlink).
    log.error('No RPC router registered!')

    throw new Error('No RPC router registered!')
  }

  return rpcRouter(path, data, client)
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

  log.debug('Extracted client from RPC call %o', client)

  return routeRpcCall(request.path, request.data, client)
}

const CHANNEL_NAME = 'Communicator'

module.exports = {
  async setup (comlink) {
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

  registerRpcRouter
}
