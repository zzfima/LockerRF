'use strict'
module.exports.GetVersion = function(req, res){
    let container = require('../containerConfig')
    let version = container.get('versionProvider')
    let answer = version.GetVersion()
    res.end(answer) 
}