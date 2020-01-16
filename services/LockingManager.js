'use strict'

module.exports = class LockingManager {
    constructor() {
        let container = require('../conteiners/containerConfig')
        let redis = require('redis')
        this._redisClient = redis.createClient()
        this._uuid_randomizer = require('uuid/v4')
    }
    /**
     * Try lock resource by resourceID
     */
    TryResourceLock(resourceID, res) {
        //Check if current resourceID exists in Redis
        this._redisClient.exists(resourceID, (err, exists) => {
            //resouce already locked, failed to lock
            if (exists == true) {
                this._SetMessageLockFailed(resourceID, res)
                return
            }
            //resouce not locked, lets try lock it
            else {
                let uuid = this._uuid_randomizer()

                this._redisClient.set(resourceID, uuid.toString(), (redisError) => {
                    //success write to redis pair <resourceID, uuid>
                    if (redisError == null) {
                        this._SetMessageLockSuccess(resourceID, res)
                    }
                    //unsuccess write to redis
                    else {
                        this._SetMessageWriteToRedisFailed(resourceID, res, redisError)
                    }
                })
            }
        })
    }

    /**
     * Try unlock resource by resourceID
     */
    TryResourceUnlock(resourceID, res) {
        //Check if current resourceID exists in Redis
        this._redisClient.exists(resourceID, (err, exists) => {
            //resouce locked, try to unlock it
            if (exists == true) {
                this._redisClient.del(resourceID, (redisError) => {
                    //success remove from redis pair <resourceID, uuid>
                    if (redisError == null) {
                        this._SetMessageUnlockSuccess(resourceID, res)
                    }
                    //unsuccess remove from redis
                    else {
                        this._SetMessageWriteToRedisFailed(resourceID, res, redisError)
                    }
                })
                return
            }
            else {
                this._SetMessageUnlockFailed(resourceID, res)
            }
        })
    }

    _SetMessageLockSuccess(resourceID, resultToSetMessage) {
        resultToSetMessage.statusCode = 200
        resultToSetMessage.setHeader('Content-Type', 'application/json')
        resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} succesefully locked`))
    }

    _SetMessageUnlockSuccess(resourceID, resultToSetMessage) {
        resultToSetMessage.statusCode = 200
        resultToSetMessage.setHeader('Content-Type', 'application/json')
        resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} succesefully unlocked`))
    }

    _SetMessageUnlockFailed(resourceID, resultToSetMessage) {
        resultToSetMessage.statusCode = 200
        resultToSetMessage.setHeader('Content-Type', 'application/json')
        resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} can not be found in Redis. Please, try later`))
    }

    _SetMessageLockFailed(resourceID, resultToSetMessage) {
        resultToSetMessage.statusCode = 500
        resultToSetMessage.setHeader('Content-Type', 'application/json')
        resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} already locked by other applicant. Please, try later`))
    }

    _SetMessageWriteToRedisFailed(resourceID, resultToSetMessage, error) {
        resultToSetMessage.statusCode = 500
        resultToSetMessage.setHeader('Content-Type', 'application/json')
        resultToSetMessage.end(JSON.stringify(`Requested Resource ID: ${resourceID} can not be changed in Redis. Redis Error code: ${error}. Please, try later`))
    }
}