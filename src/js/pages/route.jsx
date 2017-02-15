import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Route extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return <div id="map">
            <!--ng-show="auth && viz.map"-->
            <div ng-attr-id="{{'mapc' + ride.id}}">
            </div>
            <img id="marker" class="hidden"/>
            <div id="tracking"></div>
        </div>
    }
}

Route.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const RouteContainer = connect(
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
)(Route)
