
export class MyStorage {

    storage = null;

    constructor() {
        if (typeof(Storage) != "undefined") {
            storage = localStorage;
        } else {
            alert("no storage available on device");
        }
    }

    put(name, value) {
        try {
            storage.setItem(name, value);
        } catch (x) {
            alert(x);

        }
    }

    has(name) {
        try {
            if ((value = storage.getItem(name)) != undefined) {
                return true;
            }
        } catch (x) {
        }
        return false;
    }


    get(name) {
        var value;
        try {
            if ((value = storage.getItem(name)) != undefined) {
                value = storage.getItem(name);
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
            if ((value = storage.getItem(name)) != undefined) {
                storage.removeItem(name);
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
            storage.clear();
        } catch (x) {
            alert(x);
        }
    }
}
function getCurrentUser() {
    return storage.get("auth");
}

function getUser(userId) {
    return storage.get("userId" + userId);
}

function loadJSON(name) {
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
function storeJSON(name, data) {
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

function storeUser(data) {
    storage.put("userId" + data.id, data);
}



