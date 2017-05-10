import 'angular'
import $ from 'jquery'
import 'ngreact/ngReact'
import moment from 'moment'
import {debug, debug2, debugJSON} from './misc'
import * as buildTime from '../build'
import {globals} from './globals'
import storage from './storage'
import MyClient from './client'
import MyAjax from './ajax'

import {createTestData}  from '../TestData'
import App from '../App.jsx'

var local = {
    scope: function () {
        return angular.element($("#app")).scope()
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, true)
        document.addEventListener('onpluginsready', this.onPluginsReady, true)
        document.addEventListener('onload', this.onBodyLoad, false)
        document.addEventListener("resume", this.resume, false)

        angular.element(document).ready(function () {
            debug2('angular ready')
            if (typeof cordova == 'undefined') {
                angular.element($("#app")).scope().init()
            }
        })
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
        var now = moment().format('MMMM Do YYYY, h:mm:ss a')
        debug2("PELO APP " + JSON.stringify({
                build: globals.buildTime,
                run: now,
                APP: globals.APP_VERSION,
                DB: globals.DB_VERSION
            }))
    },
    resume: function () {

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
    },
    setup: function () {
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
    },
    showSplash: function () {

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

    },
}

local.bindEvents()

var peloApp = angular.module('peloApp', ['ng', 'react'])

peloApp.controller("main", function ($scope, $rootScope, platform, fb, storage, routemap) {
    local.banner()

    $scope.inited = false

    $scope.state = {globals: globals, ok: false, baseUrl: "unknown"}
    $scope.fb = fb
    $scope.routemap = routemap
    $scope.hideSplash = function () {
        platform.cordovaOnly(function () {
            try {
                navigator.splashscreen.hide()
            } catch (e) {
            }
        })
    }


    $scope.init = function () {

        if ($scope.inited)
            return

        $scope.inited = true

        platform.cordovaOnly(function () {
            try {
                showMap()
            } catch (e) {
                debug2(e)
            }
        })

    }

    $scope.initializeStorage = function () {
        $.extend($scope.state, storage.initializeStorage())
    }

    $scope.saveCurrentPage = function (page) {
        alert(page)
        storage.put('currentPage', page)
    }

    $scope.client = new MyClient(new MyAjax(platform.configure()))
    $scope.state["baseUrl"] = platform.baseUrl

    $scope.cordovaOnly = platform.cordovaOnly
})

peloApp.factory('platform', function ($rootScope) {

    var p = null

    function configurePlatform() {
        p = platform()

        debug2(`platform detected ${p}`)
        //TODO remove

        if (~['Dev', 'Unknown'].indexOf(p)) {
            this.baseUrl = globals.peloBaseUrlLocal
        } else {
            this.baseUrl = globals.peloBaseUrlMock
        }

        cordovaOnly(() => {
            this.baseUrl = globals.peloBaseUrlTryout
        })

        //FIXME change the url here
        this.baseUrl = globals.peloBaseUrlMockLocal
        //this.baseUrl = globals.peloBaseUrlLocal
        //this.baseUrl = globals.peloBaseUrlTryout

        return this.baseUrl
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

peloApp.service("storage", function () {
    function initializeStorage() {

        if (checkStorageVersion()) {
            debug2("loading storage")
            return loadStorage()
        } else {
            debug2("storage db incompatible with DB_VERSION. clearing storage")
            storage.clear()
            return {}
        }
    }

    function loadStorage() {
        var result = new Array()

        storage.forEach(function (name, value) {
            debug2("scope " + name + " " + value.substring(0, 100))
            result[name] = value
        })

        debug2("storage loaded")
        return result
    }

    function checkStorageVersion() {
        var storageVersion = storage.get("globals")
        return storageVersion == null || storageVersion.DB_VERSION == globals.DB_VERSION
    }

    return {
        initializeStorage: initializeStorage
    }
})
peloApp.service("fb", function () {

    //var appId = "1027544200612898"
    //var appId = "1697342230545684"
    //var appId = "269193253518235"
    var version = "2.8"

    function loginFB(username, success, failure) {

        if (username == undefined) {
        }

        try {
            facebookConnectPlugin.browserInit(appId, version)
        } catch (e) {
            debug2(e)
        }

        debug2('login to facebook')
        try {
            facebookConnectPlugin.login(['email', 'public_profile'], function (loginResponse) {
                    facebookConnectPlugin.api('/me?fields=email', null,
                        function (emailResponse) {
                            debug2("me: " + JSON.stringify(emailResponse))
                            //login2(response.email, userData.accessToken)
                            debug2("success" + JSON.stringify(loginResponse))
                            //response.name
                            success({fb: {userData: response, auth: loginResponse}})
                            //logoutFB()
                        })
                },
                function (error) {
                    debug2('fb api error')
                    failure("fb API error " + e)
                })
        } catch (e) {
            failure("fb plugin error 2 " + e)
        }

    }

    function loginFBTest(username, success, failure) {
        return success(createTestData().fb)
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
        loginFB: loginFBTest,
        logoutFB: logoutFB
    }

})
peloApp.service("routemap", function () {
//http://plugins.telerik.com/cordova/plugin/mapbox
    function getMapbox() {
        return Mapbox
    }

    function showMap(center, points) {
        var fifth = Math.ceil(window.innerHeight / 21)
        debug2("showMap " + JSON.stringify(center) + " " + fifth)

        Mapbox.show({
                style: 'streets', // light|dark|emerald|satellite|streets , default 'streets'
                margins: {
                    left: 0, // default 0
                    right: 0, // default 0
                    top: fifth, // default 0
                    bottom: fifth  // default 0
                },
                center: { // optional, without a default
                    lat: center.lat,
                    lng: center.lng
                },
                zoomLevel: 10, // 0 (the entire world) to 20, default 10
                showUserLocation: false, // your app will ask permission to the user, default false
                hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
                hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
                hideCompass: false, // default false
                disableRotation: false, // default false
                disableScroll: false, // default false
                disableZoom: false, // default false
                disablePitch: false, // disable the two-finger perspective gesture, default false
                /*
                 markers: [
                 {
                 lat: 52.3732160,
                 lng: 4.8941680,
                 title: 'Nice location',
                 subtitle: 'Really really nice location'
                 }
                 ]
                 */
            },

            // optional success callback
            function (msg) {
                debug2("Success :) " + JSON.stringify(msg))
            },

            // optional error callback
            function (msg) {
                debug2("Error " + JSON.stringify(msg))
            }
        )

        const poly = {
            fillcolor: 0x00666666,
            alpha: 0.5,
            points: points
        }

        try {
            Mapbox.addPolygon(poly, function () {
                console.log("done")
            }, function (e) {
                console.log("rrrr " + JSON.stringify(e))
            })
        } catch (e) {
            console.log("rats " + e)
        }
    }

    function addMarker(marker, cb) {
        marker = {title: 'MEMO', ... marker}

        Mapbox.addMarkerCallback(function (selectedMarker) {
            var title = marker.title
            debug2("Marker selected: " + JSON.stringify(selectedMarker) + " " + title)
            if (selectedMarker.title == title) {
                cb()
            }
        })

        Mapbox.addMarkers([marker])
        /*
         [
         {
         lat: 52.3602160, // mandatory
         lng: 4.8891680, // mandatory
         title: 'One-line title here', // no popup unless set
         subtitle: 'Infamous subtitle!' // can't span multiple lines, so keep it short and sweet
         },
         ]
         )*/

    }

    function hide() {
        Mapbox.hide(
            {},
            function (msg) {
                console.log("Mapbox successfully hidden")
            }
        )
    }

    var options = {timeout: 5000, enableHighAccuracy: true, maximumAge: 30000}

    function getLocation(success, error, fatal) {
        if (navigator.geolocation) {
            debug2('geolocate ' + JSON.stringify(navigator.geolocation))
            navigator.geolocation.getCurrentPosition(
                //var watchID = navigator.geolocation.watchPosition(
                function (position) {
                    debug2('geolocated ' + position.coords.latitude + " " + position.coords.longitude)

                    success({'lat': position.coords.latitude, 'lng': position.coords.longitude})
                    try {
                        if (watchID)
                            navigator.geolocation.clearWatch(watchID)
                    } catch (e) {
                    }
                },
                function (x) {
                    debug2('geolocate error ' + x.code + " " + x.message)
                    try {
                        if (watchID)
                            navigator.geolocation.clearWatch(watchID)
                    } catch (e) {
                    }
                    error(x)
                }
                , options
            )
        } else {
            fatal()
        }
    }

    function getLocation2(success, error, fatal) {
        success({
            lat: -33.908936,
            lng: 151.1559316
        })
    }

    return {
        showMap: showMap,
        hideMap: hide,
        getLocation: getLocation2,
        addMarker: addMarker
    }
})
peloApp.directive('peloApp', function (reactDirective) {
    return reactDirective(App)
})
