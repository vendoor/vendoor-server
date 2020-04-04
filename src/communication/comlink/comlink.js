const url = require('url')

const CL = require('@dwmt/comlink')

const messaging = require('./messaging')
const notification = require('./notification')
const rpc = require('./rpc')
const log = require('../../util/log')

let comlink

module.exports = {
  name: 'communication',
  dependencies: ['database'],

  async setup (server) {
    comlink = new CL.Server()

    const wsChannels = []

    wsChannels.push(
      await messaging.setup(comlink, server),
      await notification.setup(comlink, server),
      await rpc.setup(comlink, server)
    )

    server.on('upgrade', function upgrade (request, socket, head) {
      // FIXME: Change the base value, this is only a temporary hack to use the new URL API.
      const path = new url.URL(request.url, 'http://localhost').pathname
      const channel = wsChannels.find(c => c.path === path)

      log.debug('New WS connection received on path "%s"', path)

      if (channel) {
        channel.ws.handleUpgrade(request, socket, head, function done (ws) {
          log.debug('WS connection established on path "%s"', path)

          channel.ws.emit('connection', ws, request)
        })
      } else {
        log.debug('Comlink channel not found for path "%s"', path)

        socket.destroy()
      }
    })
  },
  async teardown () {
    await rpc.teardown()
    await notification.teardown()
    await messaging.teardown()
  },

  rpc () {
    return rpc
  },
  notification () {
    return notification
  },
  messaging () {
    return messaging
  }
}
