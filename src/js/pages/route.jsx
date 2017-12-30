import React from 'react'
import PropTypes from 'prop-types';

import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {ngScope} from '../service/bridge'

import {ReactMaterialImage} from 'react-material-image'
import MyComponent, {myAsyncFormConnect, Catch} from '../widget/common'
import MyRouteMap from '../widget/routemap'
import {Divider} from 'material-ui'
import * as select from '../handler/selectors'

@myAsyncFormConnect()
export default class RideRoute extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
    }


    render() {
        const {selectedRide, rideId, routeId, route, difficulty} = this.props
        return (
            route === undefined ? <div/> :
                <div>
                    <Catch>
                        <Card className="card">
                            <CardHeader title={route.title} subtitle={route.description} />
                            <CardMedia overlay={<CardTitle title={route.title} subtitle={route.slug}/>}>
                                {selectedRide.participants.map(p =>
                                    <Card>
                                        <CardMedia overlay={<CardTitle title={p.slug}/>}>
                                            <ReactMaterialImage class="round-image"
                                                                src={ngScope().state.baseUrl + `userimage/${p.id}`}/>
                                        </CardMedia>
                                    </Card>
                                )}
                            </CardMedia>
                            <CardText>
                                {difficulty} {route.distance}km.
                            </CardText>
                            <CardActions>
                                <FlatButton label="Go"/>
                            </CardActions>
                        </Card>
                        <hr/>
                        <MyRouteMap rideId={rideId} routeId={routeId} route={route}/>
                    </Catch>
                </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        console.log('component will receive props')
    }

    componentDidMount() {
        console.log('route component did mount for route ' + this.props.routeId)
        //console.log(debug0(this.props.route)
        var {router} = this.props
        //router.setRouteLeaveHook(this.props.route, this.routerWillLeave)

        this.timerID = setInterval(
            () => this.updateMyLocation(),
            5000
        )

        this.otherTimerID = setInterval(
            () => this.updateOthersLocations(),
            20000
        )

        this.updateMyLocation()
        this.updateOthersLocations()
    }

    updateOthersLocations() {
        try {
            var {userId, rideId, myLocation, dispatch} = this.props

            if (rideId < 0)
                return

            ngScope().client.checkRidersLocations(rideId, (name, data) => {
                    dispatch({
                        type: `RIDER_LOCATIONS`,
                        payload: data
                    })

                    data.map((o) => {
                        var m = {title: o.userId, ...o.location}
                        ngScope().routemap.addMarker(m, () => {
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
        var {rideId, userId, dispatch, myLocation} = this.props
        //var rideId = this.props.route.id
        //var userId =

        try {
            console.log(`get location for ${rideId} ${userId}`)
            if (rideId < 0)
                return
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
                    ngScope().routemap.addMarker(m, () => {
                        alert('ME')
                    })
                }, () => {
                    console.log('post location error')
                })
            }, () => {
                console.log('location error')
            }, () => {
                console.log('location fatal')
            })
        } catch (e) {
            console.log(e)
        }
    }

    componentWillUnmount() {
        console.log('myroutemap component will unmount')
        clearInterval(this.timerID)
        clearInterval(this.otherTimerID)

    }

    static propTypes = {
        rideId: PropTypes.number.isRequired,
        routeId: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        route: PropTypes.object.isRequired,
        myLocation: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        difficulty: PropTypes.string.isRequired,
        selectedRide: PropTypes.object.isRequired,
    }

    static defaultProps = {
        rideId: 0,
        routeId: 0,
        userId: 0,
        myLocation: {},
        route: {},
        difficulty: 'unknown'
    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: (props) => new Promise((resolve, reject) => {
            const {rideId} = RideRoute.reduxPropsConfig(props.store.getState())

            if (rideId === undefined || rideId === -1)
                return reject("rideId is " + rideId)

            ngScope().client.rideRoute(rideId, (name, data) => {
                resolve(data)
            }, e => reject(e))
        }).catch((e) => {
            console.log(e)
            throw e
        })
    }]

    static reduxPropsConfig = (state, props) => ({
        route: state.route,
        userId: state.login.id,
        myLocation: state.riderLocation,
        rideId: select.currentRideId(state),
        routeId: select.currentRouteId(state),
        difficulty: select.difficultyLevel(state.route),
        selectedRide: select.selectedRide(state)
    })

    static reduxDispatchConfig = (dispatch) => ({
        dispatch: (e) => {
            dispatch(e)
        },

    })
}
