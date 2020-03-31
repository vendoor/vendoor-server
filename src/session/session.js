const authentication = require('../security/authentication/authentication')

async function getSessionForToken (token) {
  authentication.extractDataFromToken(token)
}

function getTokenForUserSession (userIdentifier) {
  return {}
}

module.exports = {
  getSessionForToken,
  getTokenForUserSession
}
