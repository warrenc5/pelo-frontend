import React, { PropTypes } from 'react'

import MyComponent from './common'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import {debug0,debug2, debugJSON} from '../service/misc'

@myAsyncFormConnect()
export default class MyRouteMap extends MyComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        debug2('route component did mount')
        //debug0(this.props.route)
        var {router} = this.props
        //router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        debug0(router.getCurrentLocation())
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
        return (<div>{route.name}</div>)
    }

    showMap2() {
        console.log('showing map2')

        console.log('route ' + this.props.route)
        console.log('route center ' + JSON.stringify(this.props.route.center))

        try {
            ngScope().routemap.showMap(this.props.route.center, this.props.route.route)
        } catch (e) {
            console.log(e)
        }
    }

    componentWillReceiveProps(nextProps) {
        debug2('route component will receive props')
    }

    static propTypes = {
        //route: PropTypes.array.isRequired
    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            //TODO get route if not already present
            const {ride} = store.getState()
            //TODO get the selected ride
            ngScope().client.rideRoute(ride.id, (name, data)=> {
                resolve(data)
            }, (e)=> {
                reject(e)
            })
        }).then((result) =>result).catch((e)=> {
            console.log(e)
            throw e
        })
    }]


    static reduxPropsConfig = (state, props) => ({
        route: state.route

    })

    static reduxDispatchConfig = (dispatch) => ({
        updateLocation: (id) => {
            dispatch({})
        }
    })
}
