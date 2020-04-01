const CL = require('@dwmt/comlink')

module.exports = {
  comlink: true,
  name: 'Vendoor',
  commands: {
    setup (token = undefined) {
      if (!token) {
        this.log('set the token with `setHeader(\'jwtToken\', \'tokenValue\')` and connect with `connect()`')
      } else {
        this.setHeader('jwtToken', token)
        this.connect()
      }
      return 'Setup vendoor configuration'
    }
  },
  configurator (comlink) {
    comlink.registerDialect({
      name: 'call',
      interface: {
        path: '',
        data: ''
      },
      router (route) {
        return {
          path: route
        }
      },
      parameter (params) {
        return {
          data: params
        }
      }
    })

    comlink.registerDialect({
      name: 'message',
      interface: {
        sendTo: '',
        message: ''
      },
      router (route) {
        return {
          sendTo: route
        }
      },
      parameter (params) {
        return {
          message: params
        }
      }
    })

    comlink.registerHeader({
      name: 'jwtToken',
      type: 'automatic',
      storage: CL.Storage.NodeStorage,
      key: 'x-jwt-token',
      inject: false
    })

    comlink.registerChannel({
      type: 'ws',
      name: 'Communicator',
      ssl: false,
      uri: 'localhost:3000/Communicator',
      default: true,
      auth: true,
      authHeader: 'jwtToken',
      rpc: {
        retryInterval: 300,
        maxRetries: 40,
        dialects: ['call']
      }
    })

    comlink.registerChannel({
      type: 'ws',
      name: 'Notification',
      ssl: false,
      uri: 'localhost:3000/Notification',
      default: false,
      auth: true,
      authHeader: 'jwtToken',
      rpc: {
        retryInterval: 300,
        maxRetries: 40,
        dialects: []
      }
    })

    comlink.registerChannel({
      type: 'ws',
      name: 'Messaging',
      ssl: false,
      uri: 'localhost:3000/Messaging',
      default: false,
      auth: true,
      authHeader: 'jwtToken',
      rpc: {
        retryInterval: 300,
        maxRetries: 40,
        dialects: ['message']
      }
    })

    return comlink
  }
}
