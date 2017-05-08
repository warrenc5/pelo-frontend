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
    }

    componentDidMount() {
        debug2('myroutemap component did mount')
        //debug0(this.props.route)
        var {router} = this.props
        //router.setRouteLeaveHook(this.props.route, this.routerWillLeave)

        this.showMap2()
        /**
         * TODO: auto login for testing
         * const {dispatch} = this.props
         * dispatch(submit(LoginForm))
         */
    }

    render() {
        //TODO add header or footer
        const {route} = this.props
        return (<div></div>)
    }

    showMap2() {
        console.log('showing map2')

        //console.log(JSON.stringify(this.props.route))
        /**
        console.log('route ' + this.props.route + " " + this.props.route.length)
        console.log('route center ' + JSON.stringify(this.props.route.center))

        try {
            ngScope().routemap.showMap(this.props.route.center, this.props.route.route)
        } catch (e) {
            console.log(e)
        }
         **/
    }

    static propTypes = {
        route: PropTypes.object.isRequired
    }

    static reduxPropsConfig = (state, props) => ({
        route: state.route
            //[props.routeId]
    })

    static reduxDispatchConfig = (dispatch) => ({
        updateLocation: (id) => {
            dispatch({})
        }
    })
}
