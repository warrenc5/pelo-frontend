import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'

@myAsyncFormConnect()
export default class Messages extends MyComponent {
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

    static propTypes = {
        onClick2: PropTypes.func.isRequired,
        id: PropTypes.bool.isRequired
    }


    static reduxPropsConfig = (state, props) => ({
        id: state.todaysRides.id
    })

    static reduxDispatchConfig = (dispatch) => ({
        onClick2: (id) => {
            dispatch(toggleTracking(id))
        }
    })

}



