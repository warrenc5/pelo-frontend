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
    return {
        login: ajax('body-login-wozza-xlUCd.json'),
        todaysRides: {id: true},
        groups: ajax("body-groups-7-Ag7Fp.json"),
    }
}

exports.default = createTestData
