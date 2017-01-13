import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Messages extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return
        <div ng-show="auth !=null && viz.messages" id="messages">
            <div ng-show="messages.length==0">
                <img src="img/empty.png"/>
                <span class="dark">No messages, start some rides, join some groups.</span>
            </div>
            <ul ng-repeat="message in messages">
                <li>
                    <hr/>
                    <img class="round-image" avatar2 user="{{from}}"/>
                    <span>message.when</span>

                    <p>message.message</p>
                </li>
            </ul>
            <br/>
        </div>
    }
}

Messages.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const MessagesContainer = connect(
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
)(Messages)


