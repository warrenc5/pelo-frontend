//TODO: formalize calls to Promises
export default class MyClient {

    constructor(ajax) {
        this.ajax = ajax
        console.log('********** Client Initialized ***********')
    }


    sayHello(success, failure) {
        this.ajax.call("hello", "",
            success, failure,
            "GET")
    }

    login(username, password, success, failure) {
        this.ajax.call("login", "login/" + username,
            success, failure,
            "POST", JSON.stringify({password: password}))
    }

    login2(id, email, accessToken, success, failure) {
        this.ajax.call("login", "login2",
            success, failure,
            "POST", JSON.stringify({id: id, email: email, accessToken: accessToken}))
    }

    checkRidersLocations(rideId, success, failure) {
        this.ajax.call("rideLocations" + rideId, "last-known-location/" + rideId + "?since=" + new Date((new Date().getTime() - 1000 * 60 * 60 * 24 * 15)).toISOString(), success, failure, "GET")
    }

    updateUserLocation(rideId, userId, pos, success, failure) {

        if (pos == null || pos == undefined) {
            console.log("no position ")
            return
        }
        var data = "{\"when\": " + new Date().getTime() + ", \"location\" :{ \"lat\" : " + pos.lat + ", \"lng\" : " + pos.lng + "}}"
        this.ajax.call("riderLocation" + rideId, "last-known-location/" + userId + "/" + rideId, success, failure, "POST", data)
    }

    rideRoute(rideId, success, failure) {
        this.ajax.call("ride_route" + rideId, "ride-route/" + rideId, success, failure, "GET")
    }

    messages(userId, success, failure) {
        this.ajax.call("messages", "messages/" + userId, success, failure, "GET")
    }

    images(ids, success, failure) {
        this.ajax.call("userimages", "userimageid=1;id=2", success, failure, "GET")
    }

    groups(userId, success, failure) {
        this.ajax.call("groups", "groups/" + userId, success, failure, "GET")
    }

    todaysRides(userId, success, failure) {
        this.ajax.call("todays_rides", "todays-rides/by-user/" + userId, success, failure, "GET")
    }

    newRide(values, success, failure) {
        console.log(JSON.stringify(values))
        this.ajax.call("", "rides/add/" , success, failure, "POST",JSON.stringify(values))
    }

    checkUserLocation(userId, rideId) {
        console.log('check user location')
        var satId = "satId" + rideId

        getLocation(
            function (pos) {
                console.log('located ' + JSON.stringify(pos))
                updateUserLocation(userId, rideId, pos)
            },
            function (x) {
                gEBI(satId).src = "img/sat4.png"
                console.log(x.code + " " + x.message)
            },
            function (e) {
                gEBI(satId).src = "img/sat3.png"
                console.log("location not supported " + e)
            })
    }

    toggleTracking(userId, rideId) {
        var satId = "satId" + rideId
        var name = "ride" + rideId + "currentuser" + currentUserId
        console.log('toggle tracking ' + name)

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
