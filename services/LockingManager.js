'use strict'

module.exports = class LockingManager {
    constructor(redis) {
        this._redisClient = redis.createClient()
        this._uuid_randomizer = require('uuid/v4')
    }
    /**
     * Try lock resource by resourceID
     */
    TryResourceLock = (callback, resourceID, res) => {
        //Check if current resourceID exists in Redis
        this._redisClient.exists(resourceID, (err, exists) => {
            //resouce already locked, failed to lock
            if (exists == true) {
                //this._SetMessageLockFailed(resourceID, res)
                let answer = this.SetMessageLockFailed(resourceID)
                callback(answer)
                return
            }
            //resouce not locked, lets try lock it
            else {
                let uuid = this._uuid_randomizer()

                this._redisClient.set(resourceID, uuid.toString(), (redisError) => {
                    //success write to redis pair <resourceID, uuid>
                    if (redisError == null) {
                        let answer = this.SetMessageLockSuccess(resourceID)
                        callback(answer)
                    }
                    //unsuccess write to redis
                    else {
                        let answer = this.SetMessageWriteToRedisFailed(resourceID, redisError)
                        callback(answer)
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

    //Locking 
    SetMessageLockSuccess(resourceID) {
        let statusCode = 200
        let msg = `Requested Resource ID: ${resourceID} succesefully locked`
        return { statusCode, msg }
    }

    SetMessageLockFailed(resourceID) {
        let statusCode = 500
        let msg = `Requested Resource ID: ${resourceID} already locked by other applicant. Please, try later`
        return { statusCode, msg }
    }

    SetMessageWriteToRedisFailed(resourceID, error) {
        let statusCode = 500
        let msg = `Requested Resource ID: ${resourceID} can not be changed in Redis. Redis Error code: ${error}. Please, try later`
        return { statusCode, msg }
    }

    //unlocking
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
}