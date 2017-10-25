import $ from 'jquery'
import 'angular'
import { asyncConnect as reduxAsyncConnect } from 'redux-connect'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { withDispatcher } from 'react-router-dispatcher';
//FIXME:
//import reduxConnectedPropTypes from 'redux-connected-proptypes';

export function ngScope() {
    return angular.element($("#app")).scope()
}


export function reduxConnect() {
    return target => {
        return connect(target['reduxPropsConfig'], target['reduxDispatchConfig'])(target)
    }
}
export function myAsyncFormConnect(){
    return target => {
        var {NAME,dispatcher, reduxAsyncConfig , reduxPropsConfig ,reduxDispatchConfig , reduxFormConfig } = target

        var result = target;

        if (reduxFormConfig !== null) {
            console.log(NAME + " reduxForm")
            result = reduxForm(reduxFormConfig)(target)
        }

        if (reduxAsyncConfig == null) {
            console.log(NAME + " connect")
            result = connect(reduxPropsConfig, reduxDispatchConfig)(result)
        } else {
            console.log(NAME + " reduxAsyncConnect")
            result = reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(result)
        }

        return result

        /**
        if (reduxAsyncConfig == null) {
            if (reduxFormConfig == null) {
                return connect(reduxPropsConfig, reduxDispatchConfig)(target)
            } else {
                return connect(reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target))
            }

        } else {
            if (reduxFormConfig == null) {
                return reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(target)
            } else {
                return reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target))
            }
        }
         **/

        /**
        withDispatcher(({dispatch}, {params}) => {

            // dispatch a redux route action and return the response
            return dispatch(homePageRouteAction(params.urlValue));

        })
         **/

        //FIXME:
        //return reduxConnectedPropTypes(reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target)))
    }
}
