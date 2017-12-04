import {globals} from './globals'

export function formatKm(n) {

    if (n > 999) {
        return (n / 1000).toFixed(2) + "km."
    } else {
        return n + "m."
    }
}

export function createSomeTestData(userId, rideId) {
    var pos = posify(-33.91344174742699 + Math.random(), 151.15843034349382 + Math.random())

    //console.log(JSON.stringify(pos))
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
        console.log("workers before " + workers.size)
        this.workers.forEach(function (w, n, workers) {
            console.log("stopped " + n)
            try {
                workers.delete(n)
                w.terminate()
            } catch (e) {
                console.log(e)
            }
        })
        console.log("workers after " + workers.size)
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

var seen = {}
export function debug0(o) {
    seen = {}
    oo(o)
}
function oo(o) {
    for (var p in o) {
        if (seen[p] == true) {
            //console.log(`seen ${p}`)
            continue
        } else {
            seen[p] = true
            try {
                return o[p]
            } catch (e) {
                oo(o[p])
            }
        }

    }
}
const workers = new MyWorkers()
exports.default = workers
