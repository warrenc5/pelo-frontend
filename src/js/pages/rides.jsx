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
import { ReactMaterialImage } from 'react-material-image'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

import RideRoute from './route.jsx'
import * as select from '../handler/selectors'
import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import {routes} from '../Router.jsx'
import {push} from 'react-router-redux'

@myAsyncFormConnect()
export default class Rides extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
    }

    /**
     * TODO: add scrolling
     * let onUpdate = () => {
 *   window.scrollTo(0, 0)
 * }
     *
     * http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
     *
     *
     */

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
        return rides == null ?
            <span>no rides</span> :
            <div>
                <GridList
                    cols={1}
                    style={style.gridList}
                >
                    <Subheader>{this.props.total} rides today</Subheader>
                    {rides.map((ride) => (
                    <GridTile data-scroll-reveal
                              key={ride.id}
                              title={<span>{ride.name} - <b>{ride.group.name}</b></span>}
                              subtitle={<span><b>&nbsp;{ride.startDate}&nbsp;{ride.startTime}</b> {ride.description}</span>}
                              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                              onClick={showRide(ride.id)}
                              onTouchTap={e => {
                        e.preventDefault()
                        showRide(ride.id)
                    }}>
                        <ReactMaterialImage class="round-image"
                                            src={ngScope().state.baseUrl + `groupimage/${ride.group.id}`}/>
                                            onClick={showRide(ride.id)}/>
                        {/**

                            {selectedRides[ride.id] == true && (<RideRoute rideId={ride.id}
                                                                       routeId={ride.route}/>)}
                            {this.DividerExampleMenu()}
                            **/}
                    </GridTile>
                        ))}
                </GridList>
            </div>
    }

    static propTypes = {
        showRide: PropTypes.func.isRequired,
        //id: PropTypes.bool.isRequired,
        //joinGroup: PropTypes.func.isRequired,
        //toaysRides: PropTypes.array.isRequired,
        selectedRides: PropTypes.object.isRequired,
        authId: PropTypes.number.isRequired,
    }

    static reduxAsyncConfig = [{
        key: `todaysRides`,
        promise: (props) => new Promise((resolve, reject)=> {
            var authId = select.authIdSelector(props.store.getState())
            ngScope().client.todaysRides(authId, (name, data)=> {
                resolve(data)
            }, (e)=> {
                console.log(e)
                reject(e)
            })
        })
    }]

    static reduxPropsConfig = (state, props) => ({
        total: 3,//select.mySelector(state,props),
        selectedRides: state.selectedRides,
        //todaysRides: state.todaysRides,
        authId: select.authIdSelector(state)
    })

    static reduxDispatchConfig = (dispatch) => ({
        showRide: (id) => (event) => {
            // window.scrollTo(0, 0)
            dispatch({
                type: `SELECT`,
                payload: {id: id}
            })


            dispatch(push(routes.ROUTE))
        }
    })

    static reduxFormConfig = {
        form: `RidesForm`,
    }

    static NAME = "Rides"
}
