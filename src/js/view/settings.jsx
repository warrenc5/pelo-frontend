import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return <div>
        </div>
    }
}

Settings.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const SettingsContainer = connect(
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
)(Settings)
