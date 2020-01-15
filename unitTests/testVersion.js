var assert = require('assert');
let container = require('../containerConfig')
let versionProvider = container.get('versionProvider')

describe('GetVersion', function () {
    it('GetVersion', () => {
        assert.equal(versionProvider.GetVersion(), '1.3.0')
    })
})