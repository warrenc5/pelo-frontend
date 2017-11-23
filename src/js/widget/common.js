import React from 'react'
import PropTypes from 'prop-types';
import {debug0} from '../service/misc'

//import {withDispatcher} from 'react-router-dispatcher'
//import RouteDispatcher from 'react-router-dispatcher'
import { asyncConnect as reduxAsyncConnect2 } from 'redux-connect'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
//FIXME:
//import reduxConnectedPropTypes from 'redux-connected-proptypes';

/**
 @withDispatcher(({dispatch}, {params}) => {
           return Promise.all([
           dispatch({
                type: `LOGIN`,
                payload: params.urlValue
            })
  ])

        })
 **/

//@withDispatcher(routeDispatcher: RouteDispatcher)
export default class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true, error: error, info: info});
        // You can also log the error to an error reporting service
        console.log('--->' + error + " === " + info.componentStack + "<---")
    }

    reloadOnPropsChange(props, nextProps) {
        console.log('reload on props change ' + props.location.pathName + ' ' + nextProps.location.pathName)
        return props.location.pathname !== nextProps.location.pathname;
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    componentWillUnmount() {
    }

    isError() {
        return this.state.hasError
    }
}

export class Catch extends MyComponent {
    render() {
        return super.isError()
            ? <span>{""+this.state.error}</span> :
            this.props.children === null ?
                <span>No children</span> :
                <div>{this.props.children}</div>
    }
}

export function reduxConnect() {
    return target => {
        return connect(target['reduxPropsConfig'], target['reduxDispatchConfig'])(target)
    }
}
export function myAsyncFormConnect() {
    return target => {
        var {NAME,dispatcher, reduxAsyncConfig , reduxPropsConfig ,reduxDispatchConfig , reduxFormConfig } = target

        var result = target;

        if (reduxFormConfig !== undefined) {
            console.log(NAME + " reduxForm " + reduxFormConfig)
            result = reduxForm(reduxFormConfig)(target)
        }

        if (reduxAsyncConfig !== undefined) {
            console.log(NAME + " reduxAsyncConnect")
            result = reduxAsyncConnect2(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(result)
        } else {
            console.log(NAME + " connect ") //+ reduxPropsConfig + " - "+ reduxDispatchConfig)
            result = connect(reduxPropsConfig, reduxDispatchConfig)(result)
        }

        return result

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

export function injectProps(target, name, descriptor) {
    const oldFunction = descriptor.value;

    descriptor.value = function propsInjectorFunction() {
        return oldFunction.bind(this)(this.props);
    };

    return descriptor;
}

