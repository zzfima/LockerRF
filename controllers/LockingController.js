'use strict'

let lockingControllerService = require('./LockingControllerService')

/**
 * Returns Lock service version
 */
module.exports.GetVersion = function (req, res) {
    lockingControllerService.GetVersion(req, res)
}

/**
 * Try lock resource by resourceID
 */
module.exports.TryResourceLock = function (req, res) {
    lockingControllerService.TryResourceLock(req, res)
}

/**
 * Try unlock resource by resourceID
 */
module.exports.TryResourceUnlock = function (req, res) {
    lockingControllerService.TryResourceUnlock(req, res)
}