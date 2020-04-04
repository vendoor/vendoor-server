const rpc = require('../../communication/rpc')

module.exports = {
  method: 'GET',
  url: '/documentation/rpc',
  async handler () {
    const handlers = Object.values(rpc.getRpcHandlers())
      .map(obj => {
        const result = Object.assign({}, obj)

        delete result.handler

        return result
      })

    return {
      results: handlers
    }
  }
}
