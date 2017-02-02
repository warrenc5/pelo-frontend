import 'angular'
import {debug, debug2, debugJSON} from './misc'
import * as buildTime from '../build'
import moment from 'moment'
import 'ngreact/ngReact'

import {App} from '../App'

var peloApp = angular.module('peloApp', ['ng','react'])

var local = {
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('onbodyload', this.onBodyLoad, false);
        document.addEventListener("resume", this.resume, false);
    },
    onDeviceReady: function () {
        alert('device ready')
    },
    onBodyLoad: function () {
        alert('bodyload')
    },
    resume: function () {

        debug2('resume');
        debug2(cordova.backgroundapp.resumeType);

        if (cordova.backgroundapp.resumeType == 'normal-launch') {
            cordova.backgroundapp.show()
        } else if (cordova.backgroundapp.resumeType == 'programmatic-launch') {
            // You launched programatically (through cordova.backgroundapp.show() perhaps)
            // so you should have already called renderUi() from where you called .show().
        } else {
            debug5('ready3?');
        }
    },
    setup: function () {
        try {
            debug2(cordova.backgroundapp.resumeType);
            if (cordova.backgroundapp.resumeType == 'launch') {
                onDeviceReady();
            } else {
                debug2('ready4?');
            }
        } catch (e) {
            debug2(e);
        }
    },
    showSplash: function () {

        try {
            var splashDuration = 1000;
            var fadeDuration = 1000;
            navigator.splashscreen.show();
            /*window.setTimeout(function () {
             navigator.splashscreen.hide();
             }, splashDuration - fadeDuration);
             */
        } catch (e) {
            debug2(e);
        }

        //document.addEventListener("menubutton", exitApp, false);

    }
}

local.bindEvents()


peloApp.controller("main", function ($scope, platform) {
    $scope.init = function () {
        var now = moment().format('MMMM Do YYYY, h:mm:ss a');
        debug2("PELO APP build (" + buildTime.buildTime+") run (" +now + ")")
    }

    $scope.cordovaOnly = platform.cordovaOnly

    platform.cordovaOnly(function () {
        try {
            navigator.splashscreen.hide()
        } catch (e) {
        }
    })
})

peloApp.factory('platform', function ($rootScope) {

    var p = null
    function configurePlatform() {
        p = platform()

        if (p == 'Dev') {
            $rootScope.peloBaseUrl = "http://localhost/pelo/rest/view/"
        }

        cordovaOnly(function () {
            $rootScope.peloBaseUrl = "http://10.0.0.69/pelo/rest/view/"
        })
    }

    function cordovaOnly(func) {
        if (p == 'iOS' || p == 'Android') {
            func()
        }
    }

    function platform() {

        var platforms = new Array("Android", "BlackBerry", "iOS", "webOS", "WinCE", "Tizen")

        if (typeof(device) === 'undefined') {
            return 'Dev'
        } else {
            try {
                var devicePlatform = device.platform

                for (var i = 0; i < platforms.length; i++) {
                    if (devicePlatform.search(platforms[i]) >= 0) {
                        return platforms[i]
                    }
                }
            } catch (e) {
                debug2(e)
            }
        }

        return 'Unknown'
    }

    return {
        cordovaOnly: cordovaOnly,
        configure: configurePlatform,

    }

})

peloApp.value('App', App)
