import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Rides extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return
        <div ng-show="auth && viz.rides">
            <div ng-show="todays_rides.length==0">
                <img src="img/empty.png"/>
                <span>No rides found, join some rides.</span>
            </div>
            <ul ng-repeat="ride in todays_rides">
                <li>
                    <p ng-click="toggleRide(ride.id);">
                        ride.description
                    </p>

                    <div id="map">
                        <div ng-attr-id="{{'mapc' + ride.id}}">
                        </div>
                        <img id="marker" class="hidden"/>

                        <div id="tracking"></div>
                    </div>
                    <img ng-click="toggleTracking(auth.id,ride.id);" src="img/sat1.png" id="satId{{ride.id}}"/>
                    <img ng-click="toggleRoute(ride.id)" src="img/route.png" id="rideId{{ride.id}}"/>

                    <ul ng-show="!viz['ride_users{{ride.id}}']" ng-repeat="user in ride.participants"
                        ng-if="user.id != auth.id">
                        <li>
                            <img class="round-image" avatar user="{{user}}"/>
                            <span>user.id</span>
                            <span>user.name </span>
                            <span>distances[user.id]</span>
                            <img class="round-image" ride-location user="{{user}}"/>
                            <input class="hidden" id="encoded-polyline7"/>
                        </li>
                    </ul>
                </li>
            </ul>
            <br/>
        </div>
    }
}

Rides.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const RidesContainer = connect(
    (state) => {
        return {
            id: state.todaysRides.id
        }
    },
    (dispatch) => {
        return {
            onClick2: (id) => {
                dispatch(toggleTracking(id))
            }
        }
    }
)(Rides)

