import $ from 'jquery'

function ajax(url) {
    console.log(`loading ${url}`)
    var data = $.ajax({
        url: `data/${url}`,
        dataType: "json",
        method: "get",
        async: false
    }).responseText
    //console.log(`loaded ${data}`)
    return JSON.parse(data)
}

export function createTestData() {
    console.log('loading test data')
    return {
        login: ajax('body-login-wozza-xlUCd.json'),
        todaysRides: ajax('body-by-user-17-2hs0H.json'),
        groups: ajax("body-groups-7-Ag7Fp.json"),
        fb: ajax("facebook.json"),
        route: ajax('body-ride-route-7-9RCAY.json'),
    }
}

exports.default = createTestData
