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

    FlatButtonExampleSimple = () => (
        <div>
            <FlatButton label="About Ride" />
            <FlatButton label="Riders" />
            <FlatButton label="Discussion" />
            <FlatButton label="Leaderborard" />
        </div>
    );

    render() {
        return(
            <div>
                <h2>Test6</h2>
                <div>
                    {this.FlatButtonExampleSimple()}
                </div>
                <div>
                    Text
                </div>
            </div>

        )
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

