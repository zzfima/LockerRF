'use strict'

let container = require('../conteinersConfiguration/containerConfig')
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
    lockFunction(req, res)
}

const lockFunction = (req, res) => {
    const callback = result => {
        SendMessageToSwagger(result, res)
    }

    lockingManager.TryResourceLock(callback, req)
}

/**
 * Try unlock resource by resourceID
 */
exports.TryResourceUnlock = function (req, res) {
    unlockFunction(req, res)
}

const unlockFunction = (req, res) => {
    const callback = result => {
        SendMessageToSwagger(result, res)
    }

    lockingManager.TryResourceUnlock(callback, req)
}


function SendMessageToSwagger(obj, resultToSetMessage) {
    resultToSetMessage.statusCode = obj.statusCode
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(obj.msg))
}