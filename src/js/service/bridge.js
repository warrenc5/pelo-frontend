import $ from 'jquery'
import 'angular'

export function ngScope() {
    try {
        return angular.element($("#app")).scope()
    }catch (e) {
        console.log(e)
        alert("*"+e)
    }
}

