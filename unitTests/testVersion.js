var assert = require('assert');
let container = require('../conteinersConfiguration/containerConfig')
let versionProvider = container.get('versionProvider')

describe('Get Version 1.3.0', function () {
    it('Test A', () => {
        assert.equal(versionProvider.GetVersion(), '1.3.0')
    })

    it('Test B', () => {
        assert.notEqual(versionProvider.GetVersion(), '1.2.0')
    })
})