import 'angular'
import $ from 'jquery'
import 'ngreact/ngReact'
import moment from 'moment'

import * as buildTime from '../build'
import {globals} from './globals'
import storage from './storage'
import MyClient from './client'
import MyAjax from './ajax'
import MyPlatform from './platform'
import {updateDistanceToRiders, getLocation} from './location.js'
import {createTestData} from '../TestData'
import App from '../App.jsx'

export var peloApp = angular.module('peloApp', ['ng', 'react'])

peloApp.controller("main", function ($scope, $rootScope, platform, fb, storage, routemap) {

    $scope.inited = false

    $scope.state = {globals: globals, ok: false, baseUrl: "unknown"}
    $scope.fb = fb
    $scope.routemap = routemap
    $scope.initReactBridge = function (o) {
        console.log('react brige init')
    }

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
        console.log("initializing angular scope")

        $scope.inited = true

        platform.cordovaOnly(()=>console.log("cordova detected"))
        platform.notification()
    }

    $scope.authId = function () {
        return $scope.state.login != null ? $scope.state.login.id : -1
    }

    $scope.initializeStorage = function () {
        console.log("storage initialized")
        $.extend($scope.state, storage.initializeStorage())
    }

    $scope.saveCurrentPage = function (page) {
        alert(page)
        storage.put('currentPage', page)
    }

    $scope.client = new MyClient(new MyAjax(platform))
    $scope.state["baseUrl"] = platform.baseUrl
    $scope.cordovaOnly = platform.cordovaOnly
    $scope.state["device"] = device
    $scope.platform = platform

    $scope.init()
})

peloApp.factory('platform', function ($rootScope) {
        return new MyPlatform($rootScope)
})

peloApp.service("storage", function () {
    function initializeStorage() {
        console.log("initializing storage")

        if (checkStorageVersion()) {
            console.log("loading storage")
            return loadStorage()
        } else {
            console.log("storage db incompatible with DB_VERSION. clearing storage")
            storage.clear()
            return {}
        }
    }

    function loadStorage() {
        var result = new Array()

        storage.forEach(function (name, value) {
            console.log(name, value.substring(0, 100))
            result[name] = value
        })

        console.log("storage loaded")
        return result
    }

    function checkStorageVersion() {
        var storageVersion = storage.get("globals")
        return storageVersion == null || storageVersion.DB_VERSION == globals.DB_VERSION
    }

    return {
        initializeStorage: initializeStorage,
        loadJSON: storage.loadJSON,
        storeJSON: storage.storeJSON
    }
})
peloApp.service("fb", function () {

    var version = "2.8"
    var appId = "300437200400045"

    function loginFB(username, success, failure) {

        if (username == undefined) {
        }

        try {
            facebookConnectPlugin.browserInit(appId, version)
        } catch (e) {
            console.log(e)
        }
        try {
            console.log('login status ' + facebookConnectPlugin.getLoginStatus())
        } catch (e) {
            console.log("aerr 2" + JSON.stringify(e))
        }

        try {
            console.log('access token ' + facebookConnectPlugin.getAccessTokon())
        } catch (e) {
            console.log("aerr 3" + JSON.stringify(e))
        }

        /**
         try {
            facebookConnectPlugin.showDialog()
        } catch (e) {
            console.log("aerr 4" + JSON.stringify(e))
        }
         **/

        console.log('login to facebook')

        try {
            facebookConnectPlugin.login(['email', 'public_profile'], function (loginResponse) {
                    facebookConnectPlugin.api('/me?fields=email', null,
                        function (emailResponse) {
                            console.log("me: " + JSON.stringify(emailResponse))
                            //login2(response.email, userData.accessToken)
                            console.log("success" + JSON.stringify(loginResponse))
                            //response.name
                            success({fb: {userData: emailResponse, auth: {...loginResponse.authResponse}}})
                            //logoutFB()
                        })
                },
                function (error) {
                    console.log('fb api error')
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
        console.log('logout of facebook')
        try {
            facebookConnectPlugin.browserInit(appId, version)
        } catch (e) {
            console.log(e)
        }
        try {
            facebookConnectPlugin.logout(function () {
                    console.log('fb logout')
                },
                function (e) {
                    console.log('fb logout fail' + e)
                })
        } catch (e) {
            console.log(e)
        }
    }

    return {
        //loginFB: loginFBTest,
        loginFB: loginFB,
        logoutFB: logoutFB,

        //showDialog:facebookConnectPlugin.showDialog
    }

})
peloApp.service("routemap", function (storage) {
//http://plugins.telerik.com/cordova/plugin/mapbox
    function getMapbox() {
        return Mapbox
    }

    function showMap(center, points) {
        var fifth = 3 * Math.ceil(window.innerHeight / 8)
        console.log("showMap " + JSON.stringify(center) + " " + fifth)
        //style: 'streets', // light|dark|emerald|satellite|streets , default 'streets'
        Mapbox.show({

                div: 'map_canvas',
                style: 'mapbox://styles/mapbox/streets-v8',

                margins: {
                    left: 0, // default 0
                    right: 0, // default 0
                    top: fifth, // default 0
                    bottom: 0  // default 0
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
                console.log("Success :) " + JSON.stringify(msg))
            },

            // optional error callback
            function (msg) {
                console.log("Error " + JSON.stringify(msg))
            }
        )

        const poly = {
            fillcolor: 0x00666666,
            alpha: 0.3,
            points: points
        }

        try {
            Mapbox.addPolyline(poly, function () {
                console.log("done")
            }, function (e) {
                console.log("rrrr " + JSON.stringify(e))
            })
        } catch (e) {
            console.log("rats " + e)
        }
    }


    function addMarker(marker, cb) {
        marker = {title: 'MEMO', ...marker}
        console.log("add marker " + JSON.stringify(marker));
        if (Mapbox.getCenter() != undefined)
            try {

                Mapbox.addMarkerCallback(function (selectedMarker) {
                    var title = marker.title
                    console.log("Marker selected: " + JSON.stringify(selectedMarker) + " " + title)
                    if (selectedMarker.title == title) {
                        cb()
                    }
                })

                Mapbox.addMarkers([marker])
            } catch (e) {
                console.log(e)
            }
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


    function getLocation2(success, error, fatal) {
        success({
            lat: -33.908936,
            lng: 151.1559316
        })
    }

    /*
     function updateDistanceToRiders2(currentUserPos, riderLocations) {
     //var currentUserPos = storage.loadJSON("lastKnownLocation")
     //var riderLocations = storage.loadJSON("rideLocations")
     var distances = updateDistanceToRiders(currentUserPos, riderLocations)
     storage.storeJSON("distances", distances)
     return distances
     }
     */

    return {
        showMap: showMap,
        hideMap: hide,
        getLocation: getLocation2,
        addMarker: addMarker,
        updateDistanceToRiders: updateDistanceToRiders
    }
})
peloApp.directive('peloApp', function (reactDirective) {
    try {
        return reactDirective(App)
    } catch (e) {
        console.log(e)
    }
})


