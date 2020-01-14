let container = require('kontainer-di')
module.exports = container
let versionProvider = require('./services/versionProvider')

container.register('versionProvider', [], versionProvider)