import $ from 'jquery'
import security from './security'
import storage from './storage'
import * as misc from './misc'

function onDeviceReady() {
    //cordova only
    misc.debug2('device ready');
}

function onBodyLoad() {
    debug2('bodyload');
}

function ang() {
    return angular.element($("#app")).scope();

}
angular.element(function () {
    ang().init();
});

var inited = false;

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


var peloApp = angular.module('peloApp', []);

peloApp.factory('storage', function () {
    return {
        clear: storage.clear,
        has: storage.has,
        put: storage.put,
        get: storage.get,
    }
});

peloApp.factory('platform', function () {

    var peloBaseUrl = null;
    var p;

    function configurePlatform() {
        p = platform();

        if (p == 'Dev') {
            peloBaseUrl = "http://localhost/pelo/rest/view/";
        }

        cordovaOnly(function () {
            peloBaseUrl = "http://10.0.0.69/pelo/rest/view/";
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

peloApp.service('security', function () {

    function doLogin() {
        debug.debug2("**********!")
    }

    return {
        logout: security.logout,
        needsToSignIn: security.needsToSignIn,
        doLogin: security.doLogin,
        checkLogin: security.checkLogin,
        getCurrentUser: security.getCurrentUser,
        getUser: security.getUser,
    }

})

peloApp.controller("ctrl", function ($scope, $http, $timeout, $interval, security, platform, storage, debug) {
    $scope.init = function () {

        platform.configure();

        if (inited)
            return;

        platform.cordovaOnly(function () {
            try {
                navigator.splashscreen.hide();
            } catch (e) {
            }
        })

        inited = true;

        security.checkLogin(function () {
            debug.debug2("login")
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
});


