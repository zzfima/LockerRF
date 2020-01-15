let container = require('kontainer-di')
module.exports = container
let versionProvider = require('./services/VersionProvider')

container.register('versionProvider', [], versionProvider)