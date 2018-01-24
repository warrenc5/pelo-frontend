

export function getLocation(success, error, fatal) {
    if (navigator.geolocation) {
        console.log('geolocating')
        //TODO: can use some of these options in settings
        var options = { maximumAge: 20000, timeout: 2000, enableHighAccuracy: false }
        navigator.geolocation.getCurrentPosition(
            //var watchID = navigator.geolocation.watchPosition(
            function (position) {
                console.log('geolocated ' + position.coords.latitude + " " + position.coords.longitude)

                success({'lat': position.coords.latitude, 'lng': position.coords.longitude})
                try {
                    if (watchID)
                        navigator.geolocation.clearWatch(watchID)
                } catch (e) {
                }
            },
            function (x) {
                console.log('geolocate error ' + x.code + " " + x.message)
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

export function updateDistanceToRiders(currentUser,currentUserPos, riderLocations) {

    if (currentUserPos == null) {
        console.log("unknown user location")
        return {}
    }

    console.log("calculating distance " + riderLocations.length)
    var distances = {}

    for (var k = 0; k < riderLocations.length; k++) {

        if (riderLocations[k].location == undefined)
            continue

        if (currentUser!=riderLocations[k].userId) {
            var distance = distanceBetween(currentUserPos, riderLocations[k].location)

            console.log("distance to " + riderLocations[k].userId + " " + distance)
            distances[riderLocations[k].userId] = formatKm(distance)
        }
    }
    return distances
}
