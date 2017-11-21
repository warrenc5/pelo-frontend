import React from 'react'
import PropTypes from 'prop-types';

import * as Router from '../Router.jsx'
import { connect } from 'react-redux'
import Divider from 'material-ui/Divider'
import {Menu, MenuItem} from 'material-ui/Menu'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {ngScope} from '../service/bridge'
import style from '../layout/style'
import MyComponent,{myAsyncFormConnect} from '../widget/common'
import {  RaisedButton} from 'material-ui'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

import RideRoute from './route.jsx'
import * as select from '../handler/selectors'

@myAsyncFormConnect()
export default class Rides extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
    }

    DividerExampleMenu = () => (
        <Menu desktop={true} style={style}>
            <MenuItem primaryText="Place - Akuna Bay via Church Point"/>
            <MenuItem primaryText="Time - 6:30am - 10:30am"/>
            <MenuItem primaryText="Created by: John Smith"/>
            <MenuItem primaryText="Coffee Stop: ABC Cafe"/>
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
        const rides = this.props.todaysRides
        const {selectedRides,showRide} = this.props
        //TODO don't do this here - do it up there
        return rides==null?
            (<span>no rides</span>):(
            <div>
                <span>size:{rides.length} rides today</span>
                {rides.map((ride) => (
                <div key={ride.id}>
                    <RaisedButton label={ride.id} onClick={showRide(ride.id)}/>
                    {selectedRides[ride.id] == true && <RideRoute rideId={ride.id} routeId={ride.id}/>}
                    <span>id : {ride.id}</span><br/>
                    <span>name :{ride.name}</span>
                    <div>
                        <a href="http://placehold.it"><img src="http://placehold.it/350x150"></img></a>
                    </div>
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
        //todaysRides: PropTypes.array.isRequired,
        selectedRides: PropTypes.object.isRequired,
        authId: PropTypes.number.isRequired,
    }

    static reduxAsyncConfig = [{
        key: `todaysRides`,
        promise: (props) => new Promise((resolve, reject)=> {
            var authId = select.authIdSelector(props.store.getState())
            ngScope().client.todaysRides(authId, (name, data)=> {
                resolve(data.sort((a, b)=>a.id > b.id))
            }, (e)=> {
                console.log(e)
                reject(e)
            })
        })
            /**
        }).then((result) =>result).catch((e)=> {
            console.log(e)
            throw e
        })
             **/
    }]

    static reduxPropsConfig = (state, props) => ({
        total: 3,//select.mySelector(state,props),
        selectedRides: state.selectedRides,
        //todaysRides: state.todaysRides,
        authId: select.authIdSelector(state)
    })

    static reduxDispatchConfig = (dispatch) => ({
        showRide: (id) => (event) => {
            dispatch({
                type: `SELECT`,
                payload: {id: id}
            })
        }
    })

    static reduxFormConfig = {
        form: `RidesForm`,
    }

    static NAME="Rides"
}
