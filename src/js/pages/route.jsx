import React from 'react'
import PropTypes from 'prop-types';

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {ngScope} from '../service/bridge'
import {debug2} from '../service/misc'
import MyComponent,{myAsyncFormConnect} from '../widget/common'
import MyRouteMap from '../widget/routemap'
import { Divider } from 'material-ui'

@myAsyncFormConnect()
export default class RideRoute extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
        this.loadRoute(this.props.routeId)
    }

    //https://www.npmjs.com/package/react-router-dispatcher

    render() {
        return (
            <div>
                <Divider />
                <MyRouteMap />
                <Divider />
            </div>
        )
        //routeId={this.props.routeId} route={this.props.route.route}/> -- not loaded yet
    }

    componentWillReceiveProps(nextProps) {
        debug2('component will receive props')
    }

    componentDidMount() {
        debug2('route component did mount for route ' + this.props.routeId)
        //debug0(this.props.route)
        var {router} = this.props
        //router.setRouteLeaveHook(this.props.route, this.routerWillLeave)


        this.timerID = setInterval(
            () => this.updateMyLocation(),
            5000
        )

        this.timerID = setInterval(
            () => this.updateOthersLocations(),
            20000
        )
        /*
         this.updateMyLocation()
         this.updateOthersLocations()
         */
    }

    updateOthersLocations() {
        try {
            var {userId,rideId,myLocation,dispatch} = this.props
            ngScope().client.checkRidersLocations(rideId, (name, data) => {
                    dispatch({
                        type: `RIDER_LOCATIONS`,
                        payload: data
                    })

                    data.map((o)=> {
                        var m = {title: o.userId, ... o.location}
                        ngScope().routemap.addMarker(m, ()=> {
                            alert(o.userId)
                        })
                    })

                    var distances = ngScope().routemap.updateDistanceToRiders(userId, myLocation, data)
                    console.log('distance ' + JSON.stringify(distances))


                }, (e) => {
                    console.log('check error ' + e)
                }
            )
        } catch (e) {
            console.log('update error ' + e)
        }
    }

    updateMyLocation() {
        var {rideId ,userId,dispatch, myLocation} = this.props
        //var rideId = this.props.route.id
        //var userId =

        try {
            console.log(`get location for ${rideId} ${userId}`)
            ngScope().routemap.getLocation((m) => {
                if (JSON.stringify(myLocation.location) === JSON.stringify(m)) {
                    console.log(`no change`)
                    return;
                }

                console.log(`update location  : ${rideId} ${userId} ${JSON.stringify(m)}`)
                if (rideId == 0 || userId == 0)
                    return
                ngScope().client.updateUserLocation(rideId, userId, m, () => {
                    dispatch({
                        type: `LOCATION`,
                        payload: {rideId: rideId, userId: userId, location: m}
                    })
                    ngScope().routemap.addMarker(m, ()=> {
                        alert('ME')
                    })
                }, () => {
                    console.log('post location error')
                })
            }, ()=> {
                console.log('location error')
            }, ()=> {
                console.log('location fatal')
            })
        } catch (e) {
            console.log(e)
        }
    }

    loadRoute(id) {
        //const {ride} = store.getState()
        //TODO get the selected ride
        ngScope().client.rideRoute(id, (name, data)=> {
            this.props.dispatch({
                type: `DOWNLOAD_ROUTE`,
                payload: data
            })
        }, (e)=> {
            console.log(e)
            throw e
        })
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

    static propTypes = {
        rideId: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        route: PropTypes.object.isRequired,
        myLocation: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
    }

    static defaultProps = {
        rideId: 0,
        userId: 0,
        myLocation: {},
        route: {}

    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            ngScope().client.rideRoute(id, (name, data)=> {
                resolve(data)
            }, e=>reject(e))
        }).then((result) => {
            this.props.dispatch({
                type: `DOWNLOAD_ROUTE`,
                payload: data
            })
        }).catch((e)=> {
            console.log(e)
            throw e
        })
    }]

    static reduxPropsConfig = (state, props) => ({
        route: state.route,
        userId: state.login.id,
        myLocation: state.riderLocation
    })

    static reduxDispatchConfig = (dispatch) => ({
        dispatch: (e) => {
            dispatch(e)
        },

    })
}
