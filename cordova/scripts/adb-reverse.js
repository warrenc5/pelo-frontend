#!/usr/bin/env node
var adb = require('node-adb');

module.exports = function (context) {
    try {
        adb({
            shell: ['reverse', 'tcp:8080', 'tcp:8080']
        }, function (result) {
            console.log("reverse " + JSON.stringify(result))
        })
    } catch (e) {
        console.log("*****" , e)
    }
}
