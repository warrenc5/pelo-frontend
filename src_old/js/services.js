import $ from 'jquery'
import _security from './security'
import _storage from './storage'
import * as misc from './misc'
import {_app,MyAjax} from './ajax'

function onDeviceReady() {
    //cordova only
    cordovaOnly(function () {
        misc.debug2('device ready');
    })
}

function onBodyLoad() {
    misc.debug2('bodyload');
}

function scope() {
    return angular.element($("#app")).scope();

}

angular.element(function () {
    scope().init();
});

function init2() {
    debug2('init2');

    getLocation(function (position) {
        alert("success " + JSON.stringify(position));
    }, function (x) {
        alert("error " + JSON.stringify(x));
    }, function (x) {
        alert("fatal " + JSON.stringify(x));
    });
}

var peloApp = angular.module('peloApp', ['ng']);

peloApp.factory('storage', function () {
    return {
        clear: _storage.clear,
        has: _storage.has,
        put: _storage.put,
        get: _storage.get,
    }
});

peloApp.factory('platform', function ($rootScope) {

    var p;

    function configurePlatform() {
        p = platform();

        if (p == 'Dev') {
            $rootScope.peloBaseUrl = "http://localhost/pelo/rest/view/";
        }

        cordovaOnly(function () {
            $rootScope.peloBaseUrl = "http://10.0.0.69/pelo/rest/view/";
        })
    }

    function cordovaOnly(func) {
        if (p == 'iOS' || p == 'Android') {
            func();
        }
    }

    function platform() {

        var platforms = new Array("Android", "BlackBerry", "iOS", "webOS", "WinCE", "Tizen");

        if (typeof(device) === 'undefined') {
            return 'Dev';
        } else {
            try {
                var devicePlatform = device.platform;

                for (var i = 0; i < platforms.length; i++) {
                    if (devicePlatform.search(platforms[i]) >= 0) {
                        return platforms[i];
                    }
                }
            } catch (e) {
                misc.debug2(e);
            }
        }

        return 'Unknown';
    }

    return {
        cordovaOnly: cordovaOnly,
        configure: configurePlatform,

    }

})

peloApp.service('debug', function () {
    return {
        debug: misc.debug,
        debug2: misc.debug2,
        debugJSON: misc.debugJSON,
    }
})

peloApp.service('local', function () {
    function doLogin() {
        var data = loadJSON("auth");
        debugJSON(data);
        if (data == null) {
            debug2("user login failed : none");
            return;
        }
        currentUserId = data.id;

        debug2("logged in user " + currentUserId);
    }
})

peloApp.factory('ajax', function () {
    const _ajax = new MyAjax(null)
    return {
        call: _ajax.remote
    }
})

peloApp.factory('app', function () {
    return {
        login2: _app.login2
    }
})

peloApp.service('security', function (app, ajax,$rootScope) {

    function login(username, password) {
        misc.debug2('login ' + username + " " + password);

        ajax.baseUrl = $rootScope.peloBaseUrl;
        app.login2(ajax, username, password)


        /*
         login(username, password, new function () {
         misc.debug2("**************");
         //FIXME
         //$scope.showPage($scope.defaultPage);
         // $scope.currentPage = $scope.defaultPage;
         });
         */
    }


    function logout(username, password) {
        $scope.hideAll();
        stopAllWorkers();
        storage.clear();
        $scope.auth = null;

        /*
         try {
         $scope.logoutFB();
         } catch (e) {
         debug2('logout fb error');
         }
         */
        _security.logout();

    };

    return {
        login: login,
        logout: logout,
        needsToSignIn: _security.needsToSignIn,
        getCurrentUser: _security.getCurrentUser,
        getUser: _security.getUser,
    }

})

peloApp.controller("main", function ($rootScope, $scope, $http, $timeout, $interval, security, platform, storage, debug, ajax) {


    $scope.cordovaOnly = platform.cordovaOnly
    $scope.inited = false
    $scope.login = security.login
    $scope.logout = security.logout
    $scope.username = "Wozza";
    $scope.password = "uyooho00";

    $rootScope.peloBaseUrl = 'wwww';

    $scope.$watch("peloBaseUrl", function (n, o, scope) {
        misc.debug2("peloBaseUrl " + n);
        ajax.baseUrl = n;
    })

    $scope.init = function () {

        platform.configure();

        if ($scope.inited)
            return;

        platform.cordovaOnly(function () {
            try {
                navigator.splashscreen.hide();
            } catch (e) {
            }
        })

        $scope.inited = true;

        _security.checkLogin($scope.username, $scope.password, function (username, password) {
            security.login(username, password);
        })
    }

    $scope.exitApp = function () {
        debug2('exit app');
        stopAllWorkers();
        try {
            window.open("logout.html", "_self");
            navigator.app.exitApp();
        } catch (e) {
            debug2(e);
        }
    }
})

peloApp.factory("fb", function () {

    //var appId = "1027544200612898";
    var appId = "1697342230545684";
    var version = "2.5";

    $scope.loginFB = function (username) {

        if (username == undefined) {
        }

        try {
            facebookConnectPlugin.browserInit(appId, version);
        } catch (e) {
            debug2(e);
        }

        facebookConnectPlugin.login(['email', 'public_profile'], function (userData) {
                facebookConnectPlugin.api('/me?fields=email', null,
                    function (response) {

                        debug2("me: " + JSON.stringify(response));
                        login2(response.email, userData.accessToken);
                        debug2("success" + JSON.stringify(userData));
                        //response.name
                        $scope.showPage('groups');
                    });
            },
            function (error) {
                debug2('fb api error');
            })
    };

    $scope.logoutFB = function () {
        facebookConnectPlugin.browserInit(appId, version);
        facebookConnectPlugin.logout(function () {
                debug2('fb logout');
            },
            function (fail) {
                debug2('fb logout fail');
            });
    }


})


