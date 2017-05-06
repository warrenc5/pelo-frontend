import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import {debug2} from '../service/misc'
import MyComponent from '../widget/common'
import MyRouteMap from '../widget/routemap'

@myAsyncFormConnect()
export default class Route extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return <div><MyRouteMap routeId={this.props.routeId} route={this.props.route}/></div>
    }

    static propTypes = {
        routeId: PropTypes.string.isRequired,
        route: PropTypes.array.isRequired,
        loadRoute: PropTypes.func.isRequired,
    }


    componentWillReceiveProps(nextProps) {
        debug2('component will receive props')
        this.props.loadRoute(this.props.routeId)
    }

    componentDidMount() {
        debug2('route component did mount for route ' + this.props.routeId)
        //TODO get route if not already present
    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
        }).then((result) =>result).catch((e)=> {
            console.log(e)
            throw e
        })
    }]

    static reduxPropsConfig = (state, props) => ({
        route: state.route
    })

    static reduxDispatchConfig = (dispatch) => ({
        loadRoute: (id)=> {
            //const {ride} = store.getState()
            //TODO get the selected ride
            ngScope().client.rideRoute(id, (name, data)=> {

                dispatch({
                    type: `DOWNLOAD_ROUTE`,
                    payload: {id: id, route: data}
                })
            }, (e)=> {
                alert('fail ' + id)
            })
        }
    })
}
