import $ from 'jquery'
import 'angular'

export default function ngScope() {
    return angular.element($("#app")).scope()
}
