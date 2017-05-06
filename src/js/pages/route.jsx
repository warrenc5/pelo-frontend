import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import {debug2} from '../service/misc'

@myAsyncFormConnect()
export default class Route extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return <span>RouteMap {this.props.routeId} goes here.</span>
    }

    static propTypes = {
       routeId: PropTypes.string.isRequired
    }

    componentDidMount() {
        debug2('route component did mount')
    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            //TODO get route if not already present
            //const {ride} = store.getState()
            alert('get ride' + this.props.routeId)
            //TODO get the selected ride
            ngScope().client.rideRoute(this.props.routeId, (name, data)=> {
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
    })

    static reduxDispatchConfig = (dispatch) => ({
    })

}
