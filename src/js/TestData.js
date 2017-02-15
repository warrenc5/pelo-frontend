import $ from 'jquery'

export var initialState = {
    todaysRides: {id: true},
    groups: JSON.parse($.ajax({
        url: "/data/body-groups-7-Ag7Fp.json",
        dataType: "json",
        method: "get",
        async: false
    }).responseText)
}

exports.default = initialState
