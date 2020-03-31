const url = require('url')

const CL = require('@dwmt/comlink')

const messaging = require('./messaging')
const notification = require('./notification')
const rpc = require('./rpc')

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
      const path = new url.URL(request.url).pathname

      const channel = wsChannels.find(c => c.path === path)

      if (channel) {
        channel.ws.handleUpgrade(request, socket, head, function done (ws) {
          channel.ws.emit('connection', ws, request)
        })
      } else {
        socket.destroy()
      }
    })
  },
  async teardown () {
    await rpc.teardown()
    await notification.teardown()
    await messaging.teardown()
  }
}
