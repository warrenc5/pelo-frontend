import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import MyComponent, {Catch, myAsyncFormConnect} from '../widget/common'
import * as select from '../handler/selectors'

import {ngScope} from "../service/bridge";
import style from "../layout/style";


import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import {GridList, GridTile} from 'material-ui/GridList';
import {ReactMaterialImage} from 'react-material-image'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

@myAsyncFormConnect()
export default class Messages extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        const {messages} = this.props

        return <div>

            {messages.length == 0 ? <span class="dark">No messages, start some rides, join some groups.</span> :
                <span></span>}

            {messages.map(message =>
                <Card className="card">
                    <CardHeader title={message.title} subtitle={message.when}>
                        <ReactMaterialImage class="round-image"
                                            src={ngScope().state.baseUrl + `userimage/${message.from}`}/>
                    </CardHeader>
                    <CardText>
                        {message.message}
                    </CardText>
                    <CardMedia>
                    </CardMedia>
                    <CardActions>
                        <FlatButton label="Reply"/>
                        <FlatButton label="Delete"/>
                    </CardActions>
                </Card>
            )}
        </div>
    }

    static
    propTypes = {
        messages: PropTypes.array.isRequired,
        authId: PropTypes.number.isRequired,
    }

    static
    reduxPropsConfig = (state, props) => ({
        messages: state.messages,
        authId: select.authIdSelector(state)
    })

    static
    reduxDispatchConfig = (dispatch) => ({})

    static
    messagePromise = (props) => new Promise((resolve, reject) => {
        var authId = select.authIdSelector(props.store.getState())

        ngScope().client.messages(authId, (name, data) => {
            resolve(data)
        }, (e) => {
            reject(e)
        })
    })

    static
    reduxAsyncConfig =
        [{
            key: 'messages',
            promise: (props) => Messages.messagePromise(props)
        }]
}
