import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import Divider from 'material-ui/Divider'
import {Menu, MenuItem} from 'material-ui/Menu'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {ngScope,myAsyncFormConnect} from '../service/bridge'
import style from '../layout/style'

class Rides extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    DividerExampleMenu = () => (
        <Menu desktop={true} style={style}>
            <MenuItem primaryText="Place - Akuna Bay via Church Point"/>
            <MenuItem primaryText="Time - 6:30am - 10:30am"/>
            <MenuItem primaryText="Created by: John Smith"/>
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
        return (
            <div>
                <h2>Rides</h2>
                <div>
                    {this.DividerExampleMenu()}
                </div>
                <div>
                    {this.TableExampleSimple()}
                </div>
            </div>

        )
    }

    static propTypes = {
        onClick2: PropTypes.func.isRequired,
        //id: PropTypes.bool.isRequired,
        //joinGroup: PropTypes.func.isRequired,
        //groups: PropTypes.array.isRequired
    }

    static reduxAsyncConfig = [{
        key: `todaysRides`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            const {auth} = store.getState()
            ngScope().client.todaysRides(auth.id, (name, data)=> {
                resolve(data)
            }, (e)=> {
                reject(e)
            })
        }).then((result) =>result).catch((e)=> {
            console.log(e)
        })
    }]

    static reduxPropsConfig = (state, props) => ({
        total: 3,//select.mySelector(state,props),
        todaysRides: state.todaysRides,
        //userId: state.login.id,
        //id: state.todaysRides.id
    })

    static reduxDispatchConfig = (dispatch) => ({
        onClick2: (id) => {
            dispatch(toggleTracking(id))
        }
    })

    static reduxFormConfig = {
        form: `LoginForm`,
    }
}


@myAsyncFormConnect()
export default class RidesContainer extends Rides {
}
