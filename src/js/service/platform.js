import {globals} from './globals'

export default class MyPlatform {

    constructor(scope) {
        this.configurePlatform()
        this.cordovaOnly(function () {
            document.addEventListener("offline", function () {
                alert('offline')
                console.log('offline')
            }, false)

            document.addEventListener("online", function () {
                alert('online')
                console.log('online')
            }, false)
        })
    }

    isOnline() {

        if (typeof navigator.connection === 'undefined')
            return true

        return this.cordovaOnly(() => this.checkConnection() !== Connection.NONE)
    }

    checkConnection() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        console.log(networkState, states[networkState])
        return networkState
    }

    getBaseUrl() {
        return this.baseUrl
    }

    configurePlatform() {
        this.actualPlatform = this.platform()

        try {
            //TODO only do this sometimes
            window.cookieManager.clear(function () {
                console.log('Cookies cleared!');
            })
        } catch (e) {
            console.log(JSON.stringify(e))
        }

        console.log(`platform detected ${this.actualPlatform}`)

        if (~['Dev', 'Unknown'].indexOf(this.actualPlatform)) {
            this.baseUrl = globals.peloBaseUrlLocal
        } else {
            this.baseUrl = globals.peloBaseUrlTryout
        }
        this.baseUrl = globals.peloBaseUrlLocal

        this.cordovaOnly(() => {
            this.baseUrl = globals.peloBaseUrlTryout
        })

        //FIXME change the url here
        //this.baseUrl = globals.peloBaseUrlMockLocal
        //this.baseUrl = globals.peloBaseUrlTryout
    }

    cordovaOnly(func) {
        if (typeof cordova !== 'undefined') {
            return func()
        }
    }

    iosOnly(func) {
        if (this.actualPlatform == 'iOS')
            return func()
    }

    androidOnly(func) {
        if (this.actualPlatform == 'Android')
            return func()
    }

    platform() {

        //FIXME
        var platforms = new Array("Android", "BlackBerry", "iOS", "webOS", "WinCE", "Tizen")

        if (typeof(device) === 'undefined') {
            return 'Dev'
        } else {
            console.log(device)
            try {
                var devicePlatform = device.platform

                console.log(devicePlatform)
                for (var i = 0; i < platforms.length; i++) {
                    if (devicePlatform.search(platforms[i]) >= 0) {
                        return platforms[i]
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }

        return 'Unknown'
    }

    exitApp() {


        /**
         onTouch = function () {
            navigator.notification.confirm('', confirmed, 'Exit?');
        }
         **/

        this.cordovaOnly(() => {
            navigator.notification.confirm('Really', function (buttonIndex) {
                if (buttonIndex == 1) {
                    console.log("navigator.app.exitApp");
                    navigator.app.exitApp();
                }
            }, 'Exit?')
        })
    }

    //README: https://github.com/katzer/cordova-plugin-local-notifications
    notification() {
        this.cordovaOnly(() =>
            cordova.plugins.notification.local.schedule({
                title: 'My first notification',
                text: 'Thats pretty easy...',
                foreground: true
            }))
    }
}
//const storage = new MyStorage()
//export default storage
