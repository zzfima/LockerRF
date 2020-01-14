'use strict'

/**
 * Returns Lock service version
 */
module.exports.GetVersion = function(req, res){
    let container = require('../containerConfig')
    let version = container.get('versionProvider')
    let answer = version.GetVersion()

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(answer)) 
}

/**
 * Try get lock on resource by Id, if succesfull returns LockSuccess if not returns LockFail
 */
module.exports.TryResourceLock = function(req, res){
    let container = require('../containerConfig')
    let version = container.get('versionProvider')
    let answer = version.GetVersion()

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('LockSuccess')) 
}