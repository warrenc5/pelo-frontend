import 'angular'
import $ from 'jquery'
import 'ngreact/ngReact'
import moment from 'moment'
import {debug, debug2, debugJSON} from './misc'
import * as buildTime from '../build'
import * as globals from './init'
import storage from './storage'
import MyClient from './client'
import MyAjax from './ajax'

import {App} from '../App.jsx'

var local = {
    scope: function () {
        return angular.element($("#app")).scope()
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, true);
        document.addEventListener('onpluginsready', this.onPluginsReady, true);
        document.addEventListener('onload', this.onBodyLoad, false);
        document.addEventListener("resume", this.resume, false);

        angular.element(document).ready(function () {
            debug2('angular ready')
            if (typeof cordova == 'undefined') {
                angular.element($("#app")).scope().init()
            }
        });
    },
    onDeviceReady: function () { //cordova only
        debug2('device ready')
        angular.element($("#app")).scope().init()
    },
    onPluginsReady: function () {
        debug2('plugins ready')
    },
    onBodyLoad: function () {
        debug2('bodyload')
    },
    banner: function () {
        var now = moment().format('MMMM Do YYYY, h:mm:ss a');
        debug2("PELO APP " + JSON.stringify({
                build: buildTime.buildTime,
                run: now,
                APP: globals.APP_VERSION,
                DB: globals.DB_VERSION
            }))
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

peloApp.controller("main", function ($scope, $rootScope, platform, fb) {
    local.banner()

    $scope.inited = false

    $scope.state = {}

    $scope.fb = fb
    $scope.init = function () {

        if ($scope.inited)
            return

        $scope.inited = true

        platform.configure()

        platform.cordovaOnly(function () {
            try {
                navigator.splashscreen.hide()
            } catch (e) {
            }
        })

        platform.cordovaOnly(function () {
            try {
                showMap()
            } catch (e) {
                debug2(e)
            }
        });

        $scope.client = new MyClient(new MyAjax(platform.baseUrl))
    }

    $scope.initializeStorage = function initializeStorage() {

        if (checkStorageVersion()) {
            debug2("loading storage")
            return loadStorageIntoScope()
        } else {
            debug2("storage db incompatible with DB_VERSION. clearing storage")
            storage.clear()
            storage.put("globals", globals)
        }

    }

    function loadStorageIntoScope() {
        storage.forEach(function (name, value) {
            debug2("scope " + name + " " + value)
            $scope.state[name] = value
        })

        debug2("storage loaded")
        return $scope.state;
    }

    function checkStorageVersion() {
        var storageVersion = storage.get("globals")
        return storageVersion == null || storageVersion.DB_VERSION == globals.DB_VERSION
    }

    $scope.hello = function () {
        alert('hello')
    }

    $scope.cordovaOnly = platform.cordovaOnly

})

peloApp.factory('platform', function ($rootScope) {

    var p = null

    function configurePlatform() {
        p = platform()

        debug2(`platform detected ${p}`)
        //TODO remove
        this.baseUrl = "http://localhost/pelo/rest/view/"

        if (p == 'Dev') {
            this.baseUrl = "http://localhost/pelo/rest/view/"
        }

        this.baseUrl = "http://localhost:8085/pelo/rest/view/"

        /**
         cordovaOnly(() => {
            this.baseUrl = production
            //this.baseUrl = "http://dev.testpelo1.cc/pelo/rest/view/"
        })
         */
    }

    function cordovaOnly(func) {
        if (typeof cordova != 'undefined') {
            func()
        }
    }

    function iosOnly(func) {
        if (p == 'iOS')
            func()
    }

    function androidOnly(func) {
        if (p == 'Android')
            func()
    }

    function platform() {

        //FIXME
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

    function loginFB(username, success, failure) {

        if (username == undefined) {
        }

        try {
            facebookConnectPlugin.browserInit(appId, version)
        } catch (e) {
            debug2(e)
            failure("fb plugin error " + e)
            return
        }

        debug2('login to facebook')
        facebookConnectPlugin.login(['email', 'public_profile'], function (userData) {
                facebookConnectPlugin.api('/me?fields=email', null,
                    function (response) {
                        debug2("me: " + JSON.stringify(response))
                        //login2(response.email, userData.accessToken)
                        debug2("success" + JSON.stringify(userData))
                        //response.name
                        success(response)
                        //logoutFB()
                    })
            },
            function (error) {
                debug2('fb api error')
                failure(error)
            })
    }

    function logoutFB() {
        debug2('logout of facebook')
        try {
            facebookConnectPlugin.browserInit(appId, version)
        } catch (e) {
            debug2(e)
        }
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
//http://plugins.telerik.com/cordova/plugin/mapbox
function showMap() {
    debug2("showMap");

    Mapbox.show({
            style: 'emerald', // light|dark|emerald|satellite|streets , default 'streets'
            margins: {
                left: 0, // default 0
                right: 0, // default 0
                top: 400, // default 0
                bottom: 20 // default 0
            },
            center: { // optional, without a default
                lat: 52.3702160,
                lng: 4.8951680
            },
            zoomLevel: 12, // 0 (the entire world) to 20, default 10
            showUserLocation: false, // your app will ask permission to the user, default false
            hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
            hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
            hideCompass: false, // default false
            disableRotation: false, // default false
            disableScroll: false, // default false
            disableZoom: false, // default false
            disablePitch: false, // disable the two-finger perspective gesture, default false
            markers: [
                {
                    lat: 52.3732160,
                    lng: 4.8941680,
                    title: 'Nice location',
                    subtitle: 'Really really nice location'
                }
            ]
        },

        // optional success callback
        function (msg) {
            debug2("Success :) " + JSON.stringify(msg));
        },

        // optional error callback
        function (msg) {
            debug2("Error " + JSON.stringify(msg));
        }
    );

    Mapbox.addMarkerCallback(function (selectedMarker) {
        debug2("Marker selected: " + JSON.stringify(selectedMarker));
    });

    Mapbox.addMarkers(
        [
            {
                lat: 52.3602160, // mandatory
                lng: 4.8891680, // mandatory
                title: 'One-line title here', // no popup unless set
                subtitle: 'Infamous subtitle!' // can't span multiple lines, so keep it short and sweet
            },
            {}
        ]
    );
    Mapbox.addPolygon(
        {
            points: [
                {
                    lat: 52.3832160, // mandatory
                    lng: 4.8991680   // mandatory
                },
                {
                    lat: 52.3632160,
                    lng: 4.9011680
                },
                {
                    lat: 52.3932160,
                    lng: 4.8911680
                }
            ]
        }
    );
}

function hide() {
    Mapbox.hide(
        {},
        function (msg) {
            console.log("Mapbox successfully hidden");
        }
    );
}
peloApp.directive('peloApp', function (reactDirective) {
    debug2('initialing React App')
    return reactDirective(App);
});
