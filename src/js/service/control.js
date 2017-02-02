import 'angular'
import $ from 'jquery'
import {debug, debug2, debugJSON} from './misc'
import * as buildTime from '../build'
import moment from 'moment'
import 'ngreact/ngReact'
import * as globals from './init'

import {App} from '../App'

var local = {
    scope: function () {
        return angular.element($("#app")).scope()
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, true);
        document.addEventListener('onpluginsready', this.onPluginsReady, true);
        document.addEventListener('onbodyload', this.onBodyLoad, false);
        document.addEventListener("resume", this.resume, false);

        angular.element(document).ready(function () {
            debug2('angular ready')
            if (typeof cordova == 'undefined') {
                angular.element($("#app")).scope().init()
            }
        });
    },
    onDeviceReady: function () {
        debug2('device ready')
        angular.element($("#app")).scope().init()
    },
    onPluginsReady: function () {
        debug2('plugins ready')
        alert(window.plugins)
    },
    onBodyLoad: function () {
        debug2('bodyload')
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

    },

}

local.bindEvents()

var peloApp = angular.module('peloApp', ['ng', 'react'])

peloApp.controller("main", function ($scope, platform, fb) {
    $scope.inited = false

    $scope.init = function () {

        if ($scope.inited)
            return

        $scope.inited = true

        platform.configure()

        var now = moment().format('MMMM Do YYYY, h:mm:ss a');
        debug2("PELO APP " + JSON.stringify({
                build: buildTime.buildTime,
                run: now,
                APP: globals.APP_VERSION,
                DB: globals.DB_VERSION
            }))
        try {
            fb.loginFB('wozza.xing@gmail.com')
        } catch (e) {
            debug2(e)
        }

        platform.cordovaOnly(function () {
            try {
                navigator.splashscreen.hide()
            } catch (e) {
            }
        })
    }

    $scope.cordovaOnly = platform.cordovaOnly


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

peloApp.factory("fb", function () {

    //var appId = "1027544200612898"
    var appId = "1697342230545684"
    var version = "2.5"

    function loginFB(username) {

        if (username == undefined) {
        }

        try {
            alert(facebookConnectPlugin)
            facebookConnectPlugin.browserInit(appId, version)
        } catch (e) {
            debug2(e)
        }

        facebookConnectPlugin.login(['email', 'public_profile'], function (userData) {
                facebookConnectPlugin.api('/me?fields=email', null,
                    function (response) {

                        debug2("me: " + JSON.stringify(response))
                        login2(response.email, userData.accessToken)
                        debug2("success" + JSON.stringify(userData))
                        //response.name
                        $scope.showPage('groups')
                    })
            },
            function (error) {
                debug2('fb api error')
            })
    }

    function logoutFB() {
        facebookConnectPlugin.browserInit(appId, version)
        facebookConnectPlugin.logout(function () {
                debug2('fb logout')
            },
            function (fail) {
                debug2('fb logout fail')
            })
    }

    return {
        loginFB: loginFB,
        logoutFB: logoutFB
    }

})

peloApp.value('App', App)
