import $ from 'jquery'
import 'angular'
import { asyncConnect as reduxAsyncConnect } from 'redux-connect'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
//import reduxConnectedPropTypes from 'redux-connected-proptypes';

export function ngScope() {
    return angular.element($("#app")).scope()
}

export function reduxConnect() {
    return target => {
        return connect(target['reduxPropsConfig'],target['reduxDispatchConfig'])(target)
    }
}
export function myAsyncFormConnect(reduxAsyncConfig , reduxPropsConfig ,reduxDispatchConfig , reduxFormConfig) {
    return target => {
        // TODO: remove Container Class
        // const {reduxAsyncConfig , reduxPropsConfig ,reduxDispatchConfig , reduxFormConfig } = target

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
        //return reduxConnectedPropTypes(reduxAsyncConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target)))
    }
}

//connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
