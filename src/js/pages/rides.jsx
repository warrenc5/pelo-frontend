import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import Divider from 'material-ui/Divider'
import {Menu, MenuItem} from 'material-ui/Menu'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import style from '../layout/style'
import * as Router from '../Router.jsx'

@myAsyncFormConnect()
export default class Rides extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    DividerExampleMenu = () => (
        <Menu desktop={true} style={style}>
            <MenuItem primaryText="Place - Akuna Bay via Church Point"/>
            <MenuItem primaryText="Time - 6:30am - 10:30am"/>
            <MenuItem primaryText="Created by: John Smith"/>
            <MenuItem primaryText="{ride.name}"/>
            <Divider />
            <MenuItem primaryText="Distance - 87km"/>
            <MenuItem primaryText="Elevation - 1400m"/>
            <MenuItem primaryText="Expected Avg pace - This will be a C Group pace 26km/h+"/>
        </Menu>
    )

    TableExampleSimple = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn>Yes</TableHeaderColumn>
                    <TableHeaderColumn>Maybe</TableHeaderColumn>
                    <TableHeaderColumn>No</TableHeaderColumn>
                    <TableHeaderColumn>Pending</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableRowColumn>4</TableRowColumn>
                    <TableRowColumn>0</TableRowColumn>
                    <TableRowColumn>0</TableRowColumn>
                    <TableRowColumn>14</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )

    render() {
        //TODO don't do this here - do it up there
        const rides = this.props.todaysRides
        const {showRide} = this.props
        return (
            <div>
                <h2>Rides</h2>
                <span>size:{rides.length}</span>
                {rides.map((ride) => (
                <div key={ride.id} onClick={showRide(ride.id)}>
                    <span>id :{ride.id}</span><br/>
                    <span>name :{ride.name}</span>
                    <div>
                        {this.DividerExampleMenu()}
                    </div>
                    <div>
                        {this.TableExampleSimple()}
                    </div>
                </div>
                    ))}
            </div>
        )
    }

    static propTypes = {
        showRide: PropTypes.func.isRequired,
        //id: PropTypes.bool.isRequired,
        //joinGroup: PropTypes.func.isRequired,
        todaysRides: PropTypes.array.isRequired
    }

    static reduxAsyncConfig = [{
        key: `route`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            const {login} = store.getState()
            if (login.id==-1) {
                router.push(Router.LOGIN)
                resolve({})
                return
            }
            ngScope().client.todaysRides(login.id, (name, data)=> {
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
        total: 3,//select.mySelector(state,props),
        todaysRides: state.todaysRides,
        userId: state.login.id,
    })

    static reduxDispatchConfig = (dispatch) => ({
        showRide: (id) => {
            alert('showing ride ' + id)
            //dispatch(toggleTracking(id))
        }
    })

    static reduxFormConfig = {
        form: `RidesForm`,
    }
}
