import {debug, debug2, debugJSON} from './misc'

export function getLocation(success, error, fatal) {
    if (navigator.geolocation) {
        debug2('geolocate ' + JSON.stringify(navigator.geolocation))
        navigator.geolocation.getCurrentPosition(
            //var watchID = navigator.geolocation.watchPosition(
            function (position) {
                debug2('geolocated ' + position.coords.latitude + " " + position.coords.longitude)

                success({'lat': position.coords.latitude, 'lng': position.coords.longitude})
                try {
                    if (watchID)
                        navigator.geolocation.clearWatch(watchID)
                } catch (e) {
                }
            },
            function (x) {
                debug2('geolocate error ' + x.code + " " + x.message)
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
        debug2("unknown user location")
        return {}
    }

    debug2("calculating distance " + riderLocations.length)
    var distances = {}

    for (var k = 0; k < riderLocations.length; k++) {

        if (riderLocations[k].location == undefined)
            continue

        if (currentUser!=riderLocations[k].userId) {
            var distance = distanceBetween(currentUserPos, riderLocations[k].location)

            debug2("distance to " + riderLocations[k].userId + " " + distance)
            distances[riderLocations[k].userId] = formatKm(distance)
        }
    }
    return distances
}
