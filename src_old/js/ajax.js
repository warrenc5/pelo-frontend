import {debug2} from './misc'

export class MyAjax {

    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    remote(name, url, delegate, method, data) {
        var xhttp;
        debug2(name + "@" + this.baseUrl + url);

        xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            switch (xhttp.readyState) {
                case 0:
                    debug2("initialized");
                    break;
                case 1:
                    debug2("connected " + method);
                    break;
                case 2:
                    debug2("receiving");
                    break;
                case 3:
                    debug2("processing " + method + " " + xhttp.status);
                    break;
                case 4:
                    debug2("finished " + xhttp.status);
                    gEBI("working").className = "hidden";
                    delegate(name, xhttp);
                    break;
            }
        };

        gEBI("working").className = "shown";

        if ("POST" == method) {
            xhttp.open(method, url, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.setRequestHeader("Content-length", data.length);
            xhttp.setRequestHeader("Connection", "close");

            xhttp.send(data);
        } else if ("GET" == method) {
            xhttp.open(method, url, true);
            xhttp.send();
        }
    }
}

export default class MyApp {

    constructor() {
    }

    login(ajax,username, password, callback) {
        ajax.remote("auth", "login/" + username, function (name, xhttp) {
                switch (xhttp.status) {
                    case 202:
                        storeJSON(name, xhttp.responseText);
                        callback();
                        break;
                    case 204:
                    default:
                        gEBI('error').innerHTML = "error logging you in, try again.";
                }
            }
            , "POST", "{\"password\":\"" + password + "\"}");
    }

    login2(ajax, username, password) {
        ajax.call("auth", "login2/" + username, function (name, xhttp) {
                switch (xhttp.status) {
                    case 200:
                        storeJSON(name, xhttp.responseText);
                        doLogin();
                        break;
                    case 204:
                    default:
                        gEBI('error').innerHTML = "error logging you in, try again.";
                }
            }
            , "POST", "{\"password\":\"" + password + "\"}");
    }
}

const _app = new MyApp()
exports = module.exports = {_app, MyAjax};

var currentUserId;

function getUserId() {
    return currentUserId;
}


function checkRidersLocations(rideId) {
    ajax(rideId, "last-known-location/" + rideId + "?since=" + new Date((new Date().getTime() - 1000 * 60 * 60 * 24 * 15)).toISOString(), function (name, xhttp) {
        switch (xhttp.status) {
            case 200:
                //debug(name,xhttp);
                var data = storeJSON("rideLocations", xhttp.responseText);

                //updateRidersLocations();
                break;
            case 204:
            default:
        }
    }, "GET");
}

function updateUserLocation(userId, rideId, pos) {

    if (pos == null || pos == undefined) {
        debug2("no position ");
        return;
    }
    setMapPos(pos);

    storage.put("lastKnownLocation", pos);
    data = "{\"when\": " + new Date().getTime() + ", \"location\" :{ \"lat\" : " + pos.lat + ", \"lng\" : " + pos.lng + "}}";
    debug2(data);

    ajax(rideId, "last-known-location/" + userId + "/" + rideId, function (rideId, xhttp) {
            var satId = "satId" + rideId;
            switch (xhttp.status) {
                case 200:
                    storeJSON("riderLocation" + rideId, xhttp.responseText);
                    img = gEBI(satId);
                    if (img != undefined) {
                        img.src = "img/sat2.png";
                    }
                    break;
                case 204:
                default:
                    gEBI(satId).src = "img/sat3.png";
            }
        }
        , "POST", data);
}

function updateDistanceToRiders() {
    var currentUserPos = loadJSON("lastKnownLocation");

    if (currentUserPos == null) {
        debug2("unknown user location");
        return;
    }

    var data = loadJSON("rideLocations");
    debug2("calculating distance " + data.length);
    var distances = {};

    for (var k = 0; k < data.length; k++) {

        var user = getUser(data[k].userId);

        if (user == null)
            continue;

        if (data[k].location == undefined)
            continue;

        if (!isCurrentUserId(data[k].userId)) {
            var distance = distanceBetween(currentUserPos, data[k].location);

            debug2("distance to " + data[k].userId + " " + distance);
            distances[data[k].userId] = formatKm(distance);
        }
    }
    storage.put("distances", JSON.stringify(distances));
    bind("distances", distances);
}

function formatKm(n) {

    if (n > 999) {
        return (n / 1000).toFixed(2) + "km.";
    } else {
        return n + "m.";
    }
}

function createSomeTestData(userId, rideId) {
    var pos = posify(-33.91344174742699 + Math.random(), 151.15843034349382 + Math.random());

    //debug2(JSON.stringify(pos));
    storage.put("lastKnownLocation", JSON.stringify(pos));

    //updateUserLocation(userId,rideId,pos);
}
function checkUserLocation(userId, rideId) {
    debug2('check user location');
    var satId = "satId" + rideId;

    getLocation(
        function (pos) {
            debug2('located ' + JSON.stringify(pos));
            updateUserLocation(userId, rideId, pos);
        },
        function (x) {
            gEBI(satId).src = "img/sat4.png";
            debug2(x.code + " " + x.message);
        },
        function (e) {
            gEBI(satId).src = "img/sat3.png";
            debug2("location not supported " + e);
        });
}

var workers = new Map();

function toggleTracking(userId, rideId) {
    var satId = "satId" + rideId;
    var name = "ride" + rideId + "currentuser" + currentUserId;
    debug2('toggle tracking ' + name);

    var tracking = workers.has(name);

    if (!tracking) {
        startWorker(name, function () {
            checkUserLocation(userId, rideId);
        });
        gEBI(satId).src = "img/sat2.png";
    } else {
        gEBI(satId).src = "img/sat1.png";
        stopWorker(name);
    }
}

function stopAllWorkers() {
    debug2("workers before " + workers.size);
    workers.forEach(function (w, n, workers) {
        debug2("stopped " + n);
        try {
            workers.delete(n);
            w.terminate();
        } catch (e) {
            debug2(e);
        }
    });
    debug2("workers after " + workers.size);
}
function stopWorker(name) {
    if (workers.has(name)) {
        var w = workers.get(name);
        workers.delete(name);
        w.terminate();
    }
}

function startWorker(name, func) {
    if (!workers.has(name)) {
        if (typeof(Worker) !== "undefined") {
            var w = new Worker("js/worker.js");
            workers.set(name, w);
            w.onmessage = func;
        } else {
            alert("No worker support");
        }
    }
}

var currentRideId;

function rideRoute(rideId) {
    currentRideId = rideId;
    ajax("ride_route", "ride-route/" + rideId,

        function (name, xhttp) {
            switch (xhttp.status) {
                case 200:
                case 204:
                    debug2(name + "  " + xhttp.status + " " + xhttp.responseText.length);
                    var data = storeJSON(name, xhttp.responseText);
                    plotFitRoute(data);
                    break;
                default:
                    debug(name, xhttp);
            }
        }, "GET");
}

function messages(userId) {
    ajax("messages", "messages/" + userId,

        function (name, xhttp) {
            switch (xhttp.status) {
                case 200:
                    debug2(name + "  " + xhttp.status + " " + xhttp.responseText.length);
                    var data = storeJSON(name, xhttp.responseText);
                    break;
                case 204:
                default:
                    debug(name, xhttp);
            }
        }, "GET");
}

function images() {
    ajax("userimages", "userimage;id=1;id=2",//+getUserId(),
        function (name, xhttp) {
            switch (xhttp.status) {
                case 200:
                    var data = storeJSON(name, xhttp.responseText);
                    //debugJSON(data);
                    break;
                case 0:
                case 204:
                    emptyGroups();
                default:
                    debug(name, xhttp);
            }
        }, "GET");
}


function groups() {
    ajax("groups", "groups/7",//+getUserId(),
        function (name, xhttp) {
            switch (xhttp.status) {
                case 200:
                    var data = storeJSON(name, xhttp.responseText);
                    debugJSON(data);
                    break;
                case 0:
                case 204:
                    emptyGroups();
                default:
                    debug(name, xhttp);
            }
        }, "GET");
}

function todaysRides() {
    ajax("todays_rides", "todays-rides/by-user/" + getUserId(),
        function (name, xhttp) {
            switch (xhttp.status) {
                case 200:
                    var data = storeJSON(name, xhttp.responseText);

                    debugJSON(data);

                    //DEBUG
                    //toggleRoute(7);
                    break;
                case 0:
                case 204:
                    emptyRides();
                default:
                    debug(name, xhttp);
            }
        }, "GET");
}


function bind(name, value) {
    var scope = angular.element('#body').scope();

    if (scope == null) {
        return;
    }

    scope.$apply(
        function () {
            scope[name] = value;
        });
}

