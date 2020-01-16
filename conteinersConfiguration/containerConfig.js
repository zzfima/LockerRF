let container = require('kontainer-di')
let versionProvider = require('../services/VersionProvider')
let lockingManager = require('../services/LockingManager')

container.register('versionProvider', [], versionProvider)
container.register('lockingManager', [], lockingManager)

module.exports = container