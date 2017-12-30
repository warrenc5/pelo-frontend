/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */
import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import style from "../layout/style";

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
}

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
})

class Comp extends Component {
  constructor(props, context) {
    super(props, context)

    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.handleTouchTap = this.handleTouchTap.bind(this)

    this.state = {
      open: false,
    }
  }

  handleRequestClose() {
    this.setState({
      open: false,
    })
  }

  handleTouchTap() {
    this.setState({
      open: true,
    })
  }

  render() {
    const standardActions = (

      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleRequestClose}
      />
    )

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
            1-2-3-4-5
          </Dialog>
          <h1>Material-UI</h1>
          <h2>example project</h2>
          <RaisedButton
            label="Super Secret Password"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Comp
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