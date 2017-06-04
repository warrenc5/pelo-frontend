/**
 * Created by wozza on 3/5/17.
 */

import 'angular'
import $ from 'jquery'
import 'ngreact/ngReact'
import moment from 'moment'
import {debug, debug2, debugJSON} from './service/misc'
import {globals} from './service/globals'
import './service/control'

export default class Local {

    scope() {
        return angular.element($("#app")).scope()
    }
    init() {
        local.banner()
        try {
            this.scope().init()
        }catch(e) {
            alert ('angular failed' + e)
        }
    }
    bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, true)
        document.addEventListener('onpluginsready', this.onPluginsReady, true)
        document.addEventListener('onload', this.onBodyLoad, false)
        document.addEventListener("resume", this.resume, false)

        var that = this
        angular.element(document).ready(function () {
            debug2('angular ready')
            if (typeof cordova == 'undefined') {
            }
            try {
                that.init()
            }catch(e){
                alert(e)
            }
        })
    }
    onDeviceReady() { //cordova only
        debug2('device ready')
    }
    onPluginsReady() {
        debug2('plugins ready')
    }
    onBodyLoad() {
        debug2('bodyload')
    }
    banner() {
        var now = moment().format('MMMM Do YYYY, h:mm:ss a')
        debug2("PELO APP " + JSON.stringify({
                build: globals.buildTime,
                run: now,
                APP: globals.APP_VERSION,
                DB: globals.DB_VERSION
            }))
    }
    resume() {
        debug2('resume')
        debug2(cordova.backgroundapp.resumeType)

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
            debug2(cordova.backgroundapp.resumeType)
            if (cordova.backgroundapp.resumeType == 'launch') {
                onDeviceReady()
            } else {
                debug2('ready4?')
            }
        } catch (e) {
            debug2(e)
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
            debug2(e)
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
