const impl = require('./comlink/rpc')

module.exports = {
  registerRpcHandler ({ path, handler }) {
    impl.instance().registerRpcHandler(path, handler)
  }
}
