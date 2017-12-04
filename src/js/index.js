/**
 * Created by wozza on 3/5/17.
 */

import 'angular'
import $ from 'jquery'
import moment from 'moment'

import {globals} from './service/globals'
import './service/control'

export default class Local {
    constructor() {
        this.banner()
    }

    scope() {
        return angular.element($("#app")).scope()
    }
    init() {
        try {
            this.scope().init()
        }catch(e) {
            alert ('angular failed' + e)
        }
    }

    bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, true)
        document.addEventListener('pluginsready', this.onPluginsReady, true)
        document.addEventListener('load', this.onBodyLoad, true)
        document.addEventListener("resume", this.resume, true)

        angular.element(document).ready(function () {
            local.angularReady = true
            console.log('angular ready')
            local.go()
        })
    }
    onDeviceReady(e) { //cordova only
        local.cordovaReady = true
        console.log('device ready')
        local.go()
    }

    onPluginsReady() {
        console.log('plugins ready')
    }

    onBodyLoad() {
        local.documentReady = true
        console.log('bodyload')
        local.go();
    }

    go() {
        if(!local.angularReady || local.gone)
            return
        else if ((window.cordova && local.cordovaReady && local.documentReady) || local.documentReady) {
            console.log('going')
            local.gone =true
            angular.bootstrap(document.getElementById('app'), ['peloApp']);
            scope().init()

        }
    }

    banner() {
        var now = moment().format('MMMM Do YYYY, h:mm:ss a')
        console.log("PELO APP " + JSON.stringify({
                build: globals.buildTime,
                run: now,
                APP: globals.APP_VERSION,
                DB: globals.DB_VERSION
            }))
    }

    resume() {
        console.log('resume')
        console.log(cordova.backgroundapp.resumeType)

        if (cordova.backgroundapp.resumeType == 'normal-launch') {
            cordova.backgroundapp.show()
        } else if (cordova.backgroundapp.resumeType == 'programmatic-launch') {
            // You launched programatically (through cordova.backgroundapp.show() perhaps)
            // so you should have already called renderUi() from where you called .show().
        } else {
            debug5('ready3?')
        }
    }

    setup() {
        try {
            console.log(cordova.backgroundapp.resumeType)
            if (cordova.backgroundapp.resumeType == 'launch') {
                onDeviceReady()
            } else {
                console.log('ready4?')
            }
        } catch (e) {
            console.log(e)
        }
    }
    showSplash() {

        try {
            var splashDuration = 2000
            var fadeDuration = 1000
            navigator.splashscreen.show()
            /*window.setTimeout(function () {
             navigator.splashscreen.hide()
             }, splashDuration - fadeDuration)
             */
        } catch (e) {
            console.log(e)
        }

        //document.addEventListener("menubutton", exitApp, false)
    }



}

var local = new Local();
try {
    local.bindEvents()
}catch (e) {
    alert (e)
}
