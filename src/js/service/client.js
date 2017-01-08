export default class MyClient {

    constructor() {
    }

    login(ajax, username, password, resumeLoginSuccess, resumeLoginFailure) {
        ajax.call("auth", "login/" + username,
            resumeLoginSuccess, resumeLoginFailure,
            "POST", JSON.stringify({password: password}))
    }

    checkRidersLocations(rideId, success, failure) {
        ajax("rideLoctions" + rideId, "last-known-location/" + rideId + "?since=" + new Date((new Date().getTime() - 1000 * 60 * 60 * 24 * 15)).toISOString(), success, failure, "GET")
    }

    updateUserLocation(userId, rideId, pos, success, failure) {

        if (pos == null || pos == undefined) {
            debug2("no position ")
            return
        }
        setMapPos(pos)

        storage.put("lastKnownLocation", pos)
        data = "{\"when\": " + new Date().getTime() + ", \"location\" :{ \"lat\" : " + pos.lat + ", \"lng\" : " + pos.lng + "}}"
        debug2(data)

        ajax("riderLocation" + rideId, "last-known-location/" + userId + "/" + rideId, success, failure, "POST", data)
    }

    rideRoute(rideId, success, failure) {
        currentRideId = rideId
        //success
        //plotFitRoute(data)
        ajax("ride_route" + rideId, "ride-route/" + rideId, success, failure, "GET")
    }

    messages(userId, success, failure) {
        ajax("messages", "messages/" + userId, success, failure, "GET")
    }

    images(ids, success, failure) {
        ajax("userimages", "userimageid=1;id=2", success, failure, "GET")
    }

    groups(userId, success, failure) {
        ajax("groups", "groups/" + userId, success, failure)
    }

    todaysRides(userId, success, failure) {
        ajax("todays_rides", "todays-rides/by-user/" + userId, success, failure, "GET")
    }

    checkUserLocation(userId, rideId) {
        debug2('check user location')
        var satId = "satId" + rideId

        getLocation(
            function (pos) {
                debug2('located ' + JSON.stringify(pos))
                updateUserLocation(userId, rideId, pos)
            },
            function (x) {
                gEBI(satId).src = "img/sat4.png"
                debug2(x.code + " " + x.message)
            },
            function (e) {
                gEBI(satId).src = "img/sat3.png"
                debug2("location not supported " + e)
            })
    }

    toggleTracking(userId, rideId) {
        var satId = "satId" + rideId
        var name = "ride" + rideId + "currentuser" + currentUserId
        debug2('toggle tracking ' + name)

        var tracking = workers.has(name)

        if (!tracking) {
            startWorker(name, function () {
                checkUserLocation(userId, rideId)
            })
            gEBI(satId).src = "img/sat2.png"
        } else {
            gEBI(satId).src = "img/sat1.png"
            stopWorker(name)
        }
    }

    toggleRoute(rideId) {
    }

}
const _client = new MyClient()
exports = module.exports = _client
exports.default = _client
