const path = require('path')

const VERSION_FILE_PATH = path.normalize(path.join(__dirname, '..', '..', '..', 'config', 'version.json'))

function readVersionData () {
  try {
    return require(VERSION_FILE_PATH)
  } catch {
    return null
  }
};

function configureVersion (config) {
  const data = readVersionData()

  if (!data) {
    return
  }

  config.set('version.branch', data['git.branch'])
  config.set('version.hash', data['git.hash'])
  config.set('version.semver', data['npm.version'])

  config.set('version.pretty', `${data['npm.version']}-${data['git.branch']}-${data['git.hash']}`)
};

module.exports = {
  configureVersion
}
