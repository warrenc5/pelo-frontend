import storage from './storage'
import {globals} from './globals'

export class MySecurity {

    logout() {
        storage.clear()
    }

    needsToSignIn() {

        if (storage.has(globals.AUTH)) {
            var data = this.getCurrentUser()

            return data == undefined || data.length == 0; // || data.lastSignedInAt < online.updatedAt
        } else {
            return true
        }

    }

    checkLogin(username,password,doLogin) {
        var data = storage.loadJSON("auth")

        if (this.needsToSignIn()) {
            doLogin(username,password)
        } else {
            this.logout()
        }
    }

    getCurrentUser() {
        return storage.get(AUTH)
    }

    getUser(userId) {
        return storage.get("userId" + userId)
    }

}

var security = new MySecurity()

module.exports = security
exports.default = security
