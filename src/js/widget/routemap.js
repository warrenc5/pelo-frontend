import React from 'react'
import PropTypes from 'prop-types';

import MyComponent,{myAsyncFormConnect} from './common'
import {ngScope} from '../service/bridge'


/**
 * The route is already loaded just interact with the map
 */
@myAsyncFormConnect()
export default class MyRouteMap extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
    }

    componentWillReceiveProps(nextProps) {
        console.log('myroutemap component will receive props')
    }

    componentDidMount() {
        console.log('myroutemap component did mount')
        this.showMap2(this.props)
    }

    componentWillUnmount() {
        console.log('myroutemap component will unmount')
        try {
            ngScope().routemap.hideMap()
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        //TODO add header or footer
        const {route} = this.props
        return (
            <div id="map-canvas"/>
        )
    }

    showMap2(nextProps) {
        console.log('showing map2')

        var {route} = nextProps
        if(route === undefined || route.route === undefined)
            return
        //console.log(JSON.stringify(this.props.route))
        console.log('route ' + route.id + " " + route.route.length)
        console.log('route center ' + JSON.stringify(route.center))

        try {
            ngScope().routemap.showMap(route.center, route.route)
        } catch (e) {
            console.log(e)
        }
    }

    static propTypes = {
        route: PropTypes.object.isRequired
    }

    static defaultProps = {}

    static reduxPropsConfig = (state, props) => ({
        route: state.route
    })

    static reduxDispatchConfig = (dispatch) => ({

        /**
         updateLocation: (id) => {
            dispatch({})
        }
         */
    })
}
