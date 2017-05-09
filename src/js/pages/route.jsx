import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import {debug2} from '../service/misc'
import MyComponent from '../widget/common'
import MyRouteMap from '../widget/routemap'
import { Divider } from 'material-ui'

@myAsyncFormConnect()
export default class Route extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
        this.props.loadRoute(this.props.routeId)
    }

    render() {
        return (
            <div>
                <Divider />
                <MyRouteMap />
                <Divider />
            </div>
        )
        //routeId={this.props.routeId} route={this.props.route.route}/> -- not loaded yet
    }

    componentWillReceiveProps(nextProps) {
        debug2('component will receive props')
    }

    componentDidMount() {
        debug2('route component did mount for route ' + this.props.routeId)
        //TODO get route if not already present
    }

    static propTypes = {
        routeId: PropTypes.number.isRequired,
        route: PropTypes.object.isRequired,
        loadRoute: PropTypes.func.isRequired,
    }

    static defaultProps = {
        route: {}
    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            ngScope().client.rideRoute(id, (name, data)=> {
                resolve(data)
            }, e=>reject(e))
        }).then((result) => {
            this.props.dispatch({
                type: `DOWNLOAD_ROUTE`,
                payload: data
            })
        }).catch((e)=> {
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
                    payload: data
                })
            }, (e)=> {
                console.log(e)
                throw e
            })
        }
    })
}
