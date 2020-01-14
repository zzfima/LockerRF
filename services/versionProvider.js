'use strict'

const config = require('config')

/**
 * Return Lock service version
 */
exports.GetVersion = function(){
    return config.get('version')
}