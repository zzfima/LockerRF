var assert = require('assert');
let versionProvider = container.get('versionProvider')


describe('Get Version', function () {
    it('should return -1 when the value is not present', function () {
        versionProvider.GetLockVersion(res)
        assert.equal(-1, -1)
    })
})