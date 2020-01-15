'use strict'

module.exports = class VersionProvider {
    constructor() {
        let config = require('config')
        this._version = config.get('version')
    }

    /**
     * Return Lock service version
     */
    GetLockVersion(res) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(this._version))
    }
}