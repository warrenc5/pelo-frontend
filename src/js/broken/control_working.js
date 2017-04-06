import $ from 'jquery'
import 'angular'
import 'angular-cookies'
import React from 'react'
import { render } from 'react-dom'
import 'ngreact/ngReact'
import ngRedux from 'ng-redux'
import { createStore } from 'redux'

import {debug, debug2, debugJSON} from './misc'
import MyAjax from './ajax'
import {globals} from './globals'
import _client from './client'
import _workers from './misc'
import _security from './security'
import _storage from './storage'

//import {App,store2} from '../App'

var app = {

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        //cordova only
        cordovaOnly(function () {
            debug2('device ready')
        })
    },
    onBodyLoad: function () {
        ('bodyload')
    }
}


function scope() {
    return angular.element($("#app")).scope()
}

//TODO: REMOVE unused
angular.element(function () {
    debug2('early init')
    //scope().init()
})

//TODO: REMOVE unused
function init2() {
    debug2('init2')

    getLocation(function (position) {
        alert("success " + JSON.stringify(position))
    }, function (x) {
        alert("error " + JSON.stringify(x))
    }, function (x) {
        alert("fatal " + JSON.stringify(x))
    })
}

var peloApp = angular.module('peloApp', ['ng', 'ngCookies', 'react', 'ngRedux'])

peloApp.config(($ngReduxProvider) => {
    $ngReduxProvider.createStoreWith((state, action)=> {
        debug2("$$$$$$$$ " + action.type)

    })
})

peloApp.factory('storage', function () {
    return {
        clear: _storage.clear,
        has: _storage.has,
        put: _storage.put,
        get: _storage.get,
        forEach: _storage.forEach,
        loadJSON: _storage.loadJSON,
    }
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

peloApp.factory('ajax', function () {
    const _ajax = new MyAjax(null)
    return {
        //call: _ajax.remote,
        fail: function () {
            debug2("failed")
        },
        working: function () {
            debug2("working")
        }
    }
})

peloApp.factory('app', function (storage, $cookies) {

    function resumeLoginSuccess(name, data) {
        if (data === undefined) {
            debug2("user login failed : none")
            return
        }
        debug2(JSON.stringify($cookies.getAll()))
        debugJSON(data)
    }

    function resumeLoginFailure(name) {
        //gEBI('error').innerHTML = "error logging you in, try again."
    }

    return {
        resumeLoginSuccess: resumeLoginSuccess,
        resumeLoginFailure: resumeLoginFailure,
        login: _client.login,
    }
})

peloApp.service('security', function (app, ajax, $rootScope) {

    function login(username, password) {
        debug2('login ' + username + " " + password)

        app.login(ajax, username, password, app.resumeLoginSuccess, app.resumeLoginFailure)
    }

    function logout(username, password) {
        $scope.hideAll()
        stopAllWorkers()
        storage.clear()
        $scope.auth = null

        /*
         try {
         $scope.logoutFB()
         } catch (e) {
         debug2('logout fb error')
         }
         */
        _security.logout()

    }

    return {
        login: login,
        logout: logout,
        needsToSignIn: _security.needsToSignIn,
        getCurrentUser: _security.getCurrentUser,
        getUser: _security.getUser,
    }

})

peloApp.controller("main", function ($rootScope, $scope, $http, $timeout, $interval, security, platform, storage, ajax, $cookies, $ngRedux) {

    $scope.cordovaOnly = platform.cordovaOnly
    $scope.inited = false
    $scope.login = security.login
    $scope.logout = security.logout
    $scope.username = "Wozza"
    $scope.password = "uyooho00"
    $scope.props = {todaysRides: {id: true}, one: "!!!!", two: "@@@@@@@@@@"}

    $rootScope.peloBaseUrl = 'wwww'

    $scope.$watch("peloBaseUrl", function (n, o, scope) {
        debug2("peloBaseUrl " + n)
        ajax.baseUrl = n
    })

    $scope.$watch("auth", functin (n, o, scope) {
        debug2("watch auth " + o + "  " + n + " ")
    })

    $scope.$watch("initit", function (n, o, scope) {
        debug2("inited")
    })

    function scopeApply(name, value) {
        scope().$apply(
            function () {
                debug2("apply " + name + " " + value)
                scope()[name] = value
            })
    }

    let unsubscribe = $ngRedux.connect(function (state = {}) {
        debug2("ngRedux" + JSON.stringify(state))
        return {something: "something"}
    }, function (dispatch) {
        return {
            something: function (data) {
                alert("hello")
            }
        }
    })(this)

    $scope.$on('$destroy', unsubscribe)

    $ngRedux.subscribe(() => {
        let state = $ngRedux.getState()
        debug2("$$$" + state)
    })

    const DOIT = "DOIT"
    $ngRedux.dispatch({type: DOIT, payload: {something: 0}})

    $scope.scopeApply = scopeApply

    function loadStorageIntoScope() {
        storage.forEach(function (name, value) {
            debug2("scope " + name + " " + value)
            $scope.props[name] = value
        })

        debug2("storage loaded")
    }

    function checkStorageVersion() {
        var storageVersion = storage.get("DB_VERSION")
        return storageVersion === undefined || storageVersion == globals.DB_VERSION
    }

    $scope.init = function () {
        platform.configure()

        ajax.baseUrl = $rootScope.peloBaseUrl
        ajax.storageApply = scopeApply

        ajax.accessToken = {accessToken: $cookies.get("ACCESS_TOKEN")}

        if ($scope.inited)
            return

        if (checkStorageVersion()) {
            debug2("loading storage")
            loadStorageIntoScope()
        } else {
            debug2("storage db incompatible with DB_VERSION. clearing storage")
            storage.clear()
            storage.put("DB_VERSION", DB_VERSION)
        }

        platform.cordovaOnly(function () {
            try {
                navigator.splashscreen.hide()
            } catch (e) {
            }
        })

        $scope.inited = true

        if ($scope.auth == null) {
            _security.checkLogin($scope.username, $scope.password, function (username, password) {
                security.login(username, password)
            })
        }
    }

    $scope.exitApp = function () {
        debug2('exit service')
        stopAllWorkers()
        try {
            window.open("logout.html", "_self")
            navigator.app.exitApp()
        } catch (e) {
            debug2(e)
        }
    }
})

peloApp.factory("fb", function () {

    //var appId = "1027544200612898"
    var appId = "1697342230545684"
    var version = "2.5"

    $scope.loginFB = function (username) {

        if (username == undefined) {
        }

        try {
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

    $scope.logoutFB = function () {
        facebookConnectPlugin.browserInit(appId, version)
        facebookConnectPlugin.logout(function () {
                debug2('fb logout')
            },
            function (fail) {
                debug2('fb logout fail')
            })
    }


})

peloApp.directive("rideLocation", function () {
    return {
        scope: {},
        link: function (scope, element, attrs) {
            var rideId = scope.$parent.ride.id
            var userId = scope.$parent.user.id
            var user = scope.$parent.user
            var rl = scope.$parent.rideLocations

            if (rl == null)
                return
            rl.forEach(function (e, i, a) {
                if (e.msWhen > new Date().getTime() - (1000 * 60 * 60 * 24 * 25)) {
                    if (e.rideId == rideId && e.userId == userId) {
                        attrs.$set("src", "img/" + ((user.role == "captain" ) ? "captain.png" : "rider.png"))
                    }
                }
            }) //forEach
        }
    }
})
peloApp.directive("avatar2", function () {
        return {
            scope: {},

            link: function (scope, element, attrs) {
                var userimages = loadJSON("userimages")
                var image = userimages["1"]
                var img = "data:image/pngbase64," + image
                //FIXME
                attrs.$set("src", img)
            }
        }
    })
    .directive("avatar", function () {
        return {
            scope: {},

            link: function (scope, element, attrs) {
                var user = scope.$parent.user

                if (user == null)
                    return

                var image = user.avatar

                if (image == null)
                    return

                if (!image.startsWith("http")) {
                    image = "img/" + image
                }

                debug2(image)
                attrs.$set("src", image)
            }
        }
    })

peloApp.filter('myfilter', function () {
    return function (items, name) {
        var filtered = []
        angular.forEach(items, function (item) {
            if (name == undefined || name == '') {
                filtered.push(item)
            }
        })
        return filtered
    }
})

peloApp.value('App', App)

/*
 peloApp.directive('react-bridge', function () {

 return {
 restrict: 'E',
 scope: {
 },
 link: function (scope, el, attrs) {
 alert("ok")
 scope.$watch('name', function (newValue, oldValue) {
 var MyComponent = React.createFactory(App2)
 ReactDOM.render(
 //MyComponent({name1: newValue}),
 App2,
 el[0]
 )
 })
 }
 }
 })
 */

//https://github.com/ngReact/ngReact
