import $ from 'jquery'
import security from './security'
import storage from './storage'
import * as misc from './misc'

function platform() {
    var platforms = new Array("Android", "BlackBerry", "iOS", "webOS", "WinCE", "Tizen");

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
    return 'Unknown';
}

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
    ang().initit();
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

peloApp.service('debug', function () {
    return {
        debug: misc.debug,
        debug2: misc.debug2,
        debugJSON: misc.debugJSON,
    }
});

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

});

peloApp.controller("ctrl", function ($scope, $http, $timeout, $interval, security, storage, debug) {
    $scope.initit = function () {


        if (inited)
            return;

        try {
            navigator.splashscreen.hide();
        } catch (e) {
        }

        inited = true;

        security.checkLogin(function() {})

        var p = platform();

        if (p == 'iOS' || p == 'Android') {
            peloBaseUrl = "http://10.0.0.69/pelo/rest/view/";
        }
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


