'use strict'
let redis = require('redis')
let config = require('config')
let redisClient = redis.createClient()
let uuid_randomizer = require('uuid/v4')
/**
 * Returns Lock service version
 */
module.exports.GetVersion = function (req, res) {
    let container = require('../containerConfig')
    let version = container.get('versionProvider')
    let answer = version.GetVersion()

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(answer))
}

/**
 * Try get lock on resource by Id, if succesfull returns LockSuccess if not returns LockFail
 */
module.exports.TryResourceLock = function (req, res) {
    let resourceID = req.body.resourceID

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

function _SetMessageLockSuccess(resourceID, resultToSetMessage) {
    resultToSetMessage.statusCode = 200
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} succesefully locked`))
}

function _SetMessageLockFailed(resourceID, resultToSetMessage) {
    resultToSetMessage.statusCode = 500
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} already locked by other applicant. Please, try later`))
}

function _SetMessageWriteToRedisFailed(resourceID, resultToSetMessage, error) {
    resultToSetMessage.statusCode = 500
    resultToSetMessage.setHeader('Content-Type', 'application/json')
    resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} can not be written to Redis, despite of its not locked. Redis Error code: ${error}. Please, try later`))
}