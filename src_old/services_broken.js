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
        debug2(e);
    }
    return 'Unknown';
}


function onDeviceReady() {
    debug2('device ready2');
}


function onBodyLoad() {
    debug2('bodyload2');
    init();
}

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


function init() {
    if (inited)
        return;

    try {
        navigator.splashscreen.hide();
    } catch (e) {
    }

    inited = true;

    debug2('init');
    checkLogin();

    var p = platform();

    if (p == 'iOS' || p == 'Android') {
        peloBaseUrl = "http://10.0.0.69/pelo/rest/view/";
    }

}

angular.element(document).ready(function () {
    init();
});

//TODO:add as angular service
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
        debug2(e);
    }
    return 'Unknown';
}


function onDeviceReady() {
    debug2('device ready2');
}


function onBodyLoad() {
    debug2('bodyload2');
    init();
}

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

function init() {
    if (inited)
        return;

    try {
        navigator.splashscreen.hide();
    } catch (e) {
    }

    inited = true;

    debug2('init');
    checkLogin();

    var p = platform();

    if (p == 'iOS' || p == 'Android') {
        peloBaseUrl = "http://10.0.0.69/pelo/rest/view/";
    }

}

peloApp.factory('storage', function () {

    alert("storage");
    /*
    var storage = new MyStorage();
    return {
        clear: storage.clear,
        has: storage.has,
        put: storage.put,
        get: storage.get,
    }
    */
});

peloApp.factory('test', function clientIdFactory() {
        return 'a12345654321x';
    })
    //.config(['$cordovaFacebook', function (cordovaFacebook) {
    //}])
    .directive('spreadsheeet', function ($compile) {
        return {
            templateUrl: innerHTML.html
        }
    });

peloApp.controller("ctrl", ["$scope", "$http", "$timeout", "$interval", function ($scope, $http, $timeout, $interval) {
//peloApp.controller('ctrl',  function ($scope, $timeout) {

        $scope.auth = loadJSON("auth");
        $scope.messages = loadJSON("messages");
        $scope.today_rides = loadJSON("todays_rides");
        $scope.distances = loadJSON("distances");
        $scope.userimages = loadJSON("userimages");
        $scope.rideLocations = loadJSON("rideLocations");
        $scope.lastKnownLocation = loadJSON("lastKnownLocation");
        $scope.groups = loadJSON("groups");

        $scope.viz = {"rides": false, "groups": false, "map": false, "auth": false, "messages": false};
        $scope.defaultPage = "messages";
        $scope.current;

        $scope.debug = true;
        $scope.username = "Wozza";
        $scope.password = "uyooho00";


        $scope.toggleRide = function (rideId) {
            $scope.viz["ride_users" + rideId] = !$scope.viz["ride_users" + rideId];
        };

        $scope.fb = function () {
            window.open("https://www.facebook.com/dialog/oauth?client_id=1027544200612898&redirect_uri=http://localhost/callback&response_type=code&scope=email&state=db0a5f5b6b98386b93b6bd95c0c7611cdbb746c69c5208da");
        }

        $scope.toggleGroup = function (groupId) {
            $scope.viz["group_users" + groupId] = !$scope.viz["group_users" + groupId];
        };

        $scope.toggleTracking = function (userId, rideId) {
            toggleTracking(userId, rideId);
        };

        var p = new Array("rides", "groups", "messages", "settings", "map");

        $scope.hideAll = function (pageId) {
            p.forEach(function (e, i, a) {
                if (e == null || e != pageId) {
                    $scope.viz[e] = false;
                }
            });
        };

        $scope.showPage = function (pageId) {
            debug2("show " + pageId);
            $scope.current = pageId;
            $scope.hideAll(pageId);
            $scope.viz[pageId] = true;
        };

        $scope.toggleRoute = function (rideId) {
            $scope.viz["ride_users" + rideId] = !$scope.viz["ride_users" + rideId];
            //debug2("ride_users"+rideId + " " + $scope.viz["ride_users"+rideId]);
            $scope.viz["map"] = $scope.viz["ride_users" + rideId]; //!$scope.viz["map"];
            //showMap();

            if ($scope.viz["map"]) {
                rideRoute(rideId);
            }
        };

        $scope.$watch("current", function (n, o, scope) {
            debug2("switched current " + $scope.current);
            switch ($scope.current) {
                case "messages":
                    images();
                    messages(currentUserId);
                    break;
                case "groups":
                    groups();
                    break;
                case "rides":
                    todaysRides();
                    break;
                default:

            }
        });

        $scope.$watch("auth", function (n, o, scope) {
            $timeout(function () {
                $scope.viz.auth = (n == null);
            });
        });

        $scope.$watchCollection("rideLocations", function (n, o, scope) {
            $timeout(function () {
                if (n != null) {
                    updateDistanceToRiders();
                }
            });
        });

        $scope.$watchCollection("todays_rides", function (n, o, scope) {
            if (n == null) {
                return;
            }

            /*FIXME
             n.forEach(function (e, i, a) {
             startWorker("ride" + e.id, function () {
             checkRidersLocations(e.id);
             });
             });
             */
        });
        //This is all cruft
        $scope.fblogin2 = function () {
            facebookConnectPlugin.getLoginStatus(function (success) {
                if (success.status === 'connected') {
                    // The user is logged in and has authenticated your service, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success.status);

                    // Check if we have our user saved
                    var user = UserService.getUser('facebook');

                    if (!user.userID) {
                        getFacebookProfileInfo(success.authResponse)
                            .then(function (profileInfo) {
                                // For the purpose of this example I will store user data on local storage
                                UserService.setUser({
                                    authResponse: success.authResponse,
                                    userID: profileInfo.id,
                                    name: profileInfo.name,
                                    email: profileInfo.email,
                                    picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                                });

                                $state.go('app.home');
                            }, function (fail) {
                                // Fail get profile info
                                console.log('profile info fail', fail);
                            });
                    } else {
                        $state.go('app.home');
                    }
                } else {
                    // If (success.status === 'not_authorized') the user is logged in to Facebook,
                    // but has not authenticated your service
                    // Else the person is not logged into Facebook,
                    // so we're not sure if they are logged into this service or not.

                    console.log('getLoginStatus', success.status);

                    $ionicLoading.show({
                        template: 'Logging in...'
                    });

                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };
    }]);
   .value('peloBaseUrl', function () {
        //peloBaseUrl= "http://10.0.0.68/pelo/rest/view/";
        return peloBaseUrl;
    })
    .controller('HomeCtrl', function ($scope, UserService, $ionicActionSheet, $state, $ionicLoading) {
        //https://ionicthemes.com/tutorials/about/native-facebook-login-with-ionic-framework
        $scope.user = UserService.getUser();

        $scope.showLogOutMenu = function () {
            var hideSheet = $ionicActionSheet.show({
                destructiveText: 'Logout',
                titleText: 'Are you sure you want to logout? This service is awsome so I recommend you to stay.',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    return true;
                },
                destructiveButtonClicked: function () {
                    $ionicLoading.show({
                        template: 'Logging out...'
                    });

                    // Facebook logout
                    facebookConnectPlugin.logout(function () {
                            $ionicLoading.hide();
                            $state.go('welcome');
                        },
                        function (fail) {
                            $ionicLoading.hide();
                        });
                }
            });
        };
    });

/*
 Brings the service to the foreground. E.g. Call this in response to a user clicking on a notification.
 */


/*
 function facebookLogin($cordovaOauth, $http)
 {
 $cordovaOauth.facebook("1633195863589792", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result){
 displayData($http, result.access_token);
 },  function(error){
 alert("Error: " + error);
 });
 }

 */
/*

 angular.module("facebookApp", ["ionic", "ngCordova"])
 .controller("mainCtrl", ["$scope", "$cordovaOauth", "$http", function($scope, $cordovaOauth, $http) {
 window.cordovaOauth = $cordovaOauth;
 window.http = $http;
 }]);


 angular.module('tryme3App').factory('SessionPresenters', function ($resource, DateUtils) {

 return $resource('api/session.Presenters/:id', {}, {
 'query': { method: 'GET', isArray: true},
 'get': {
 method: 'GET', isArray: true
 },
 'update': { method:'PUT' }
 });
 });



 service.controller('PoniesCtrl', function($scope, ponyService) {
 ponyService.getPonies().then(function(data) {
 $scope.ponies = data;
 }).catch(function() {
 $scope.error = 'unable to get the ponies';
 });
 });

 service.factory('ponyService', function($http) {
 var getPonies = function() {
 return $http.get('/api/ponies');
 };

 return {
 getPonies: getPonies
 };
 });
 */

function showMap() {
    debug2("showMap");

    Mapbox.show({
            style: 'emerald', // light|dark|emerald|satellite|streets , default 'streets'
            margins: {
                left: 0, // default 0
                right: 0, // default 0
                top: 150, // default 0
                bottom: 20 // default 0
            },
            center: { // optional, without a default
                lat: 52.3702160,
                lng: 4.8951680
            },
            zoomLevel: 12, // 0 (the entire world) to 20, default 10
            showUserLocation: false, // your service will ask permission to the user, default false
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

}
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
angular.element(document).ready(function () {
    init();
});
