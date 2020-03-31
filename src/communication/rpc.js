const impl = require('./comlink/rpc')

module.exports = {
  registerRpcHandler (path, func) {
    impl.instance().registerRpcHandler(path, func)
  }
}
