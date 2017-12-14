import storage from './storage'
import Cookie from 'tough-cookie'

export default class MyAjax {

    constructor(platform) {
        this.platform = platform
        console.log(`ajax using ${platform.getBaseUrl()}`)
        this.baseUrl = platform.getBaseUrl()
    }

    call(name, url, success, failure, method, data1) {

        if(!this.platform.isOnline())  {
           console('not online at the moment retrieve from storage')
        }

        this.platform.cordovaOnly(() => SpinnerDialog.show(name, url, () => alert('aborted ' + name)))


        var storageApply = this.storageApply

        console.log(">>" + name + "@" + this.baseUrl + url)

        url = this.baseUrl + url

        var xhttp = new XMLHttpRequest()

        var platform = this.platform

        xhttp.onreadystatechange = function () {
            switch (xhttp.readyState) {
                case 0:
                    console.log("initialized")
                    break
                case 1:
                    console.log("connected " + method)
                    xhttp.withCredentials = true

                    //xhttp.setRequestHeader("Cookie", "myccookie")

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
                    console.log("receiving")
                    break
                case 3:
                    console.log("processing " + method + " " + xhttp.status)
                    break
                case 4:
                    console.log("finished " + xhttp.status + " len:" + xhttp.responseText.length)

                    platform.cordovaOnly(() => SpinnerDialog.hide(name))
                    switch (xhttp.status) {
                        case 200:
                        case 202:
                        case 204:
                            var data = storage.storeJSON(name, xhttp.responseText)
//                            console.log('cookie:' + xhttp.getResponseHeader('Set-Cookie'))

                            if (data === undefined) {
                                console.log("error:" + xhttp.responseText)
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
    }

}

exports = module.exports = MyAjax
