import * as globals from './init'

export function debug(name, xhttp) {
    debug2(name + " " + xhttp.status + "  " + xhttp.responseText)
}

export function debug2(message) {
    if (!globals.debugFlag)
        return

    //gEBI("demo").innerHTML = message + "<br/>"+gEBI("demo").innerHTML
    console.log(message)
}


export function debugJSON(message) {
    debug2(JSON.stringify(message))
}

export function formatKm(n) {

    if (n > 999) {
        return (n / 1000).toFixed(2) + "km."
    } else {
        return n + "m."
    }
}

export function createSomeTestData(userId, rideId) {
    var pos = posify(-33.91344174742699 + Math.random(), 151.15843034349382 + Math.random())

    //debug2(JSON.stringify(pos))
    storage.put("lastKnownLocation", JSON.stringify(pos))

    //updateUserLocation(userId,rideId,pos)
}

export function bind(name, value) {
    var scope = angular.element('#body').scope()

    if (scope == null) {
        return
    }

    scope.$apply(
        function () {
            scope[name] = value
        })
}

export class MyWorkers {

    stopAllWorkers() {
        debug2("workers before " + workers.size)
        this.workers.forEach(function (w, n, workers) {
            debug2("stopped " + n)
            try {
                workers.delete(n)
                w.terminate()
            } catch (e) {
                debug2(e)
            }
        })
        debug2("workers after " + workers.size)
    }

    stopWorker(name) {
        if (this.workers.has(name)) {
            var w = this.workers.get(name)
            this.workers.delete(name)
            w.terminate()
        }
    }

    startWorker(name, func) {
        if (!this.workers.has(name)) {
            if (typeof(Worker) !== "undefined") {
                var w = new Worker("js/worker.js")
                this.workers.set(name, w)
                w.onmessage = func
            } else {
                alert("No worker support")
            }
        }
    }
}

const workers = new MyWorkers()
exports.default = workers
