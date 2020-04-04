const rpc = require('../../communication/rpc')

module.exports = {
  method: 'GET',
  url: '/documentation/rpc',
  handler () {
    return {
      results: Object.values(rpc.getRpcHandlers())
    }
  }
}
