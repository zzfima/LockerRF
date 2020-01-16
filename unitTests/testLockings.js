var assert = require('assert');
let container = require('../conteinersConfiguration/unitTestsContainerConfiguration')
let lockingManager = container.get('lockingManager')
let uuid_randomizer = require('uuid/v4')

describe('Lock resource ID aabb56785678', function () {
    it('Test lock unlock of same resourceID', () => {
        const lockFunction = (req) => {
            const callback = result => {
                assert.equal(result.msg, 'Requested Resource ID: aabb56785678 succesefully locked')
                assert.equal(result.statusCode, '200')
            }

            lockingManager.TryResourceLock(callback, req)
        }

        const unlockFunction = (req) => {
            const callback = result => {
                assert.equal(result.msg, 'Requested Resource ID: aabb56785678 succesefully unlocked')
                assert.equal(result.statusCode, '200')
            }

            lockingManager.TryResourceUnlock(callback, req)
        }

        lockFunction('aabb56785678')
        setTimeout(() => {
            unlockFunction('aabb56785678'), 100
        })
    })
})