import $ from 'jquery'
import 'angular'
import { asyncConnect as reduxAsyncConnect } from 'redux-connect'
import { reduxForm } from 'redux-form'
//import reduxConnectedPropTypes from 'redux-connected-proptypes';

export function ngScope() {
    return angular.element($("#app")).scope()
}

export function myConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig, reduxFormConfig) {
    return target => {
        return reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target))
        //return reduxConnectedPropTypes(reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target)))
    }
}
