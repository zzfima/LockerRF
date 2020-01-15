'use strict'

let container = require('../containerConfig')
let lockingManager = container.get('lockingManager')
let versionProvider = container.get('versionProvider')

/**
 * Returns Lock service version
 */
exports.GetVersion = function (req, res) {
    versionProvider.GetLockVersion(res)
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