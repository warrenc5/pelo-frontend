import {debug2} from './misc'
import storage from './storage'

export default class MyAjax {

    constructor(baseUrl) {
        debug2(`ajax using ${baseUrl}`)
        this.baseUrl = baseUrl
    }

    call(name, url, success, failure, method, data) {
        var storageApply = this.storageApply
        var xhttp

        try {
            this.working()
        } catch (e) {
        }

        debug2(name + "@" + this.baseUrl + url)

        url = this.baseUrl + url

        xhttp = new XMLHttpRequest()

        xhttp.onreadystatechange = function () {
            switch (xhttp.readyState) {
                case 0:
                    debug2("initialized")
                    break
                case 1:
                    debug2("connected " + method)
                    break
                case 2:
                    debug2("receiving")
                    break
                case 3:
                    debug2("processing " + method + " " + xhttp.status)
                    break
                case 4:
                    debug2("finished " + xhttp.status + " len:" + xhttp.responseText.length)
                    //gEBI("working").className = "hidden"
                    switch (xhttp.status) {
                        case 200:
                        case 202:
                        case 204:

                            var data = storage.storeJSON(name, xhttp.responseText)
                            debug2(xhttp.getResponseHeader('Set-Cookie'))

                            if (data === undefined) {
                                debug2("error:" + xhttp.responseText)
                            }

                            success(name, data)

                            break
                        case 0:
                        default:
                            failure(name)
                    }
                    break
                default:
                    break
            }
        }

        //gEBI("working").className = "shown"

        if ("POST" == method) {
            xhttp.open(method, url, true)
            xhttp.setRequestHeader("Content-type", "application/json")
            xhttp.setRequestHeader("Content-length", data.length)
            xhttp.setRequestHeader("Connection", "close")

            xhttp.send(data)
        } else if ("GET" == method) {
            xhttp.open(method, url, true)
            xhttp.send()
        }
    }

}

exports = module.exports = MyAjax
