import React, { PropTypes } from 'react'

import MyComponent from './common'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import {debug0,debug2, debugJSON} from '../service/misc'

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
        //debug0(this.props.route)
        var {router} = this.props
        //router.setRouteLeaveHook(this.props.route, this.routerWillLeave)

        this.timerID = setInterval(
            () => this.tick(),
            5000
        )

        /**
         * TODO: auto login for testing
         * const {dispatch} = this.props
         * dispatch(submit(LoginForm))
         */
    }

    componentWillUnmount() {
        debug2('myroutemap component will unmount')
        clearInterval(this.timerID)
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
            <div>
               <span>RouteName {route.title}
                   RouteId {route.id}: {route.route.length} geos..
                   {JSON.stringify(route).substring(0, 100)}
               </span>
            </div>
        )
    }

    tick() {
        try {
            ngScope().routemap.getLocation((m) => {
                ngScope().routemap.addMarker(m,()=>{
                    alert('My Marker')
                })
            }, ()=> {
                alert('location error')

            }, ()=> {
                alert('location fatal')
            })
        } catch (e) {
            console.log(e)
        }
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
