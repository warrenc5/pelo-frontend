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
