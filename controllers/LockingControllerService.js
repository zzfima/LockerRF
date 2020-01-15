
'use strict'

let container = require('../containerConfig')
let redis = require('redis')
let config = require('config')
let redisClient = redis.createClient()
let uuid_randomizer = require('uuid/v4')

/**
 * Returns Lock service version
 */
exports.GetVersion = function (req, res) {
    let answer = container.get('versionProvider').GetLockVersion

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(answer))
}

/**
 * Try lock resource by resourceID
 */
exports.TryResourceLock = function (req, res) {
    let resourceID = GetResourceID(req)

    //Check if current resourceID exists in Redis
    redisClient.exists(resourceID, (err, exists) => {
        //resouce already locked, failed to lock
        if (exists == true) {
            _SetMessageLockFailed(resourceID, res)
            return
        }
        //resouce not locked, lets try lock it
        else {
            let uuid = uuid_randomizer()

            redisClient.set(resourceID, uuid.toString(), (redisError) => {
                //success write to redis pair <resourceID, uuid>
                if (redisError == null) {
                    _SetMessageLockSuccess(resourceID, res)
                }
                //unsuccess write to redis
                else {
                    _SetMessageWriteToRedisFailed(resourceID, res, redisError)
                }
            })
        }
    })
}

/**
 * Try unlock resource by resourceID
 */
module.exports.TryResourceUnlock = function (req, res) {
    let resourceID = GetResourceID(req)

    //Check if current resourceID exists in Redis
    redisClient.exists(resourceID, (err, exists) => {
        //resouce locked, try to unlock it
        if (exists == true) {
            redisClient.del(resourceID, (redisError) => {
                //success remove from redis pair <resourceID, uuid>
                if (redisError == null) {
                    _SetMessageUnlockSuccess(resourceID, res)
                }
                //unsuccess remove from redis
                else {
                    _SetMessageWriteToRedisFailed(resourceID, res, redisError)
                }
            })
            return
        }
        else {
            _SetMessageUnlockFailed(resourceID, res)
        }
    })
}


function GetResourceID(request) {
    return request.body.resourceID
}

function _SetMessageLockSuccess(resourceID, resultToSetMessage) {
    resultToSetMessage.statusCode = 200
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} succesefully locked`))
}

function _SetMessageUnlockSuccess(resourceID, resultToSetMessage) {
    resultToSetMessage.statusCode = 200
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} succesefully unlocked`))
}

function _SetMessageUnlockFailed(resourceID, resultToSetMessage) {
    resultToSetMessage.statusCode = 200
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} can not be found in Redis. Please, try later`))
}

function _SetMessageLockFailed(resourceID, resultToSetMessage) {
    resultToSetMessage.statusCode = 500
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} already locked by other applicant. Please, try later`))
}

function _SetMessageWriteToRedisFailed(resourceID, resultToSetMessage, error) {
    resultToSetMessage.statusCode = 500
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} can not be changed in Redis. Redis Error code: ${error}. Please, try later`))
}