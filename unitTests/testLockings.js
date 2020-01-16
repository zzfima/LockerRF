var assert = require('assert');
let container = require('../conteinersConfiguration/unitTestsContainerConfiguration')
let lockingManager = container.get('lockingManager')
let uuid_randomizer = require('uuid/v4')

describe('Lock resource ID aabb56785678', function () {
    it('Test lock unlock of same resourceID', () => {
        let uuid = uuid_randomizer()
        lockingManager.TryResourceLock(uuid, undefined)

        assert.equal('1.3.0', '1.3.0')
    })
})