export class MyStorage {

    constructor() {
        if (typeof(Storage) != "undefined") {
        } else {
            alert("no storage available on device");
        }
    }

    put(name, value) {
        try {
            localStorage.setItem(name, value);
        } catch (x) {
            alert(x);

        }
    }

    has(name) {
        try {
            if ((value = localStorage.getItem(name)) != undefined) {
                return true;
            }
        } catch (x) {
        }
        return false;
    }


    get(name) {
        var value;
        try {
            if ((value = localStorage.getItem(name)) != undefined) {
                value = localStorage.getItem(name);
            }
            else {
                //alert("no name");
            }
        } catch (x) {
            alert(x);
        }
        return value;
    }

    remove(name) {
        var value;
        try {
            if ((value = localStorage.getItem(name)) != undefined) {
                localStorage.removeItem(name);
            }
            else {
            }
        } catch (x) {
            alert(x);
        }
        return value;
    }

    clear() {
        try {
            localStorage.clear();
        } catch (x) {
            alert(x);
        }
    }


    loadJSON(name) {
        var data = storage.get(name);
        if (data == null || data.length == 0)
            return null;

        try {
            data = JSON.parse(data);
        } catch (e) {
            debug2(data + " invalid");
            return null;
        }
        return data;
    }

    storeJSON(name, data) {
        storage.put(name, data);
        try {
            var data = JSON.parse(data);
            bind(name, data);
            return data;
        } catch (e) {
            debug2("no valid json " + name + " " + e);
            return null;
        }
    }

    storeUser(data) {
        storage.put("userId" + data.id, data);
    }
}

const storage = new MyStorage();
module.exports = storage;
