import {debug, debug2, debugJSON} from './misc'
export class MyStorage {

    constructor() {
        if (typeof(Storage) != "undefined") {
        } else {
            alert("no storage available on device")
        }
    }

    put(name, value) {
        try {
            localStorage.setItem(name, value)
        } catch (x) {
            alert(x)

        }
    }

    has(name) {
        try {
            if ((value = localStorage.getItem(name)) != undefined) {
                return true
            }
        } catch (x) {
        }
        return false
    }


    get(name) {
        var value
        try {
            if ((value = localStorage.getItem(name)) != undefined) {
                value = localStorage.getItem(name)
            }
            else {
                //alert("no name")
            }
        } catch (x) {
            alert(x)
        }
        return value
    }

    remove(name) {
        var value
        try {
            if ((value = localStorage.getItem(name)) != undefined) {
                localStorage.removeItem(name)
            }
            else {
            }
        } catch (x) {
            alert(x)
        }
        return value
    }

    clear() {
        try {
            localStorage.clear()
        } catch (x) {
            alert(x)
        }
    }

    forEach(func) {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i)
            let value = localStorage.getItem(key)
            func(key,value)
        }
    }

    loadJSON(name) {
        let data = storage.get(name)
        if (data == null || data.length == 0)
            return null

        try {
            data = JSON.parse(data)
        } catch (e) {
            debug2(data + " invalid")
            return null
        }
        return data
    }

    storeJSON(name, data) {
        if(data === undefined) {
            debug2("no data")
            return
        }

        storage.put(name, JSON.stringify(data))

        try {
            var data = JSON.parse(data)
            return data
        } catch (e) {
            debug2("no valid json " + name + " " + e  + " length: " + data.length + " data:" + data)
            return null
        }
    }

    storeUser(data) {
        storage.put("userId" + data.id, data)
    }
}

const storage = new MyStorage()
export default storage

module.exports = storage
exports.default = storage
