import React from 'react'
import PropTypes from 'prop-types';
import {debug0} from '../service/misc'

import {withDispatcher} from 'react-router-dispatcher'
import RouteDispatcher from 'react-router-dispatcher'
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
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.log('--->' + error + " === " + info.componentStack +"<---")
    }

    reloadOnPropsChange(props, nextProps) {
        console.log('reload on props change ' + props.location.pathName + ' ' + nextProps.location.pathName)
        return props.location.pathname !== nextProps.location.pathname;
    }

    componentDidMount() {
    }


    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
    }

    isError() {
        return this.state.hasError
    }
}

export class Catch extends MyComponent {
    render() {
        return super.isError()?(<span>?</span>):(this.props.children)
    }
}


