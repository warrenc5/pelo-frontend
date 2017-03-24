import {debug2} from './misc'
import storage from './storage'
import Cookie from 'tough-cookie'

export default class MyAjax {

    constructor(baseUrl) {
        debug2(`ajax using ${baseUrl}`)
        this.baseUrl = baseUrl
    }

    call(name, url, success, failure, method, data1) {
        var storageApply = this.storageApply

        try {
            this.working()
        } catch (e) {
        }

        debug2(name + "@" + this.baseUrl + url)

        url = this.baseUrl + url

        var xhttp = new XMLHttpRequest()

        xhttp.onreadystatechange = function () {
            switch (xhttp.readyState) {
                case 0:
                    debug2("initialized")
                    break
                case 1:
                    debug2("connected " + method)
                    xhttp.withCredentials = true

                    //                  xhttp.setRequestHeader("Cookie", "myccookie")

                    if ("POST" == method) {
                        xhttp.setRequestHeader("Content-Type", "application/json")
                        xhttp.setRequestHeader("Content-Length", data1.length)
                        xhttp.setRequestHeader("Connection", "close")
                        xhttp.send(data1)
                    } else if ("GET" == method) {
                        xhttp.send()
                    }
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
//                            debug2('cookie:' + xhttp.getResponseHeader('Set-Cookie'))

                            if (data === undefined) {
                                debug2("error:" + xhttp.responseText)
                            }
                            success(name, data)
                            //cookies = xhttp.getResponseHeader['set-cookie'].map(Cookie.parse);
                            //cookies = [Cookie.parse(xhttp.getResponseHeader('set-cookie'))];
                            break

                        case 0:
                        default:
                            failure({message: xhttp.status})
                    }
                    break
                default:
                    break
            }
        }

        xhttp.open(method, url, true)
        //gEBI("working").className = "shown"


    }

}

exports = module.exports = MyAjax
