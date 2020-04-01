const authentication = require('../security/authentication/authentication')

async function getSessionForToken (token) {
  return authentication.extractDataFromToken(token)
}

function getTokenForUserSession (userIdentifier) {
  return {}
}

module.exports = {
  getSessionForToken,
  getTokenForUserSession
}
