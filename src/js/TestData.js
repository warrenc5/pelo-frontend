import $ from 'jquery'

function ajax(url) {
    return JSON.parse($.ajax({
        url: `data/${url}`,
        dataType: "json",
        method: "get",
        async: false
    }).responseText)
}

export var initialState = {
    login: ajax('body-login-wozza-xlUCd.json'),
    todaysRides: {id: true},
    groups: ajax("body-groups-7-Ag7Fp.json"),
}

exports.default = initialState
