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
    let resourceID = req.body.resourceID
    lockingControllerService.TryResourceLock(resourceID, res)
}

/**
 * Try unlock resource by resourceID
 */
module.exports.TryResourceUnlock = function (req, res) {
    let resourceID = req.body.resourceID
    lockingControllerService.TryResourceUnlock(resourceID, res)
}