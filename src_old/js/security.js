import storage from './storage'
import * as globals from './init'

export class MySecurity {

    logout() {
        storage.clear();
        storage.remove("auth");
    }

    needsToSignIn() {

        if (storage.has(globals.AUTH)) {
            var data = storage.get(globals.AUTH);

            return data == undefined || data.length == 0; // || data.lastSignedInAt < online.updatedAt
        } else {
            return true;
        }

    }

    checkLogin(doLogin) {
        var data = storage.loadJSON("auth");

        if (this.needsToSignIn()) {
            this.logout();
        } else {
            doLogin();
        }
    }

    getCurrentUser() {
        return storage.get("auth");
    }

    getUser(userId) {
        return storage.get("userId" + userId);
    }

}

var security = new MySecurity();

module.exports = security;
exports.default = security;
