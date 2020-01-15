'use strict'

const config = require('config')

module.exports = class VersionProvider {
    constructor() {
        this._config = require('config')
        this._version = config.get('version')
    }

    /**
     * Return Lock service version
     */
    GetLockVersion() {
        return this._version
    }
}