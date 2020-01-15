'use strict'

let container = require('../containerConfig')
let lockingManager = container.get('lockingManager')
let versionProvider = container.get('versionProvider')

/**
 * Returns Lock service version
 */
exports.GetVersion = function (req, res) {
    let ver = versionProvider.GetVersion()

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ver))
}

/**
 * Try lock resource by resourceID
 */
exports.TryResourceLock = function (req, res) {
    lockingManager.TryResourceLock(req, res)
}

/**
 * Try unlock resource by resourceID
 */
module.exports.TryResourceUnlock = function (req, res) {
    lockingManager.TryResourceUnlock(req, res)
}