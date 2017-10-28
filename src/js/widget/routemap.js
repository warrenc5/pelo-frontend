import React from 'react'
import PropTypes from 'prop-types';

import MyComponent,{myAsyncFormConnect} from './common'
import {ngScope} from '../service/bridge'
import {debug0,debug2, debugJSON} from '../service/misc'

/**
 * The route is already loaded just interact with the map
 */
@myAsyncFormConnect()
export default class MyRouteMap extends MyComponent {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) {
        debug2('myroutemap component will receive props')
        this.showMap2(nextProps)
    }

    componentDidMount() {
        debug2('myroutemap component did mount')
    }

    componentWillUnmount() {
        debug2('myroutemap component will unmount')
    }

    render() {
        //TODO add header or footer
        const {route} = this.props
        return (
            <div>
               <span>RouteName {route.title}
                   RouteId {route.id}: {route.route.length} geos..
                   {JSON.stringify(route).substring(0, 100)}
               </span>
            </div>
        )
    }


    showMap2(nextProps) {
        console.log('showing map2')

        var {route} = nextProps
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
