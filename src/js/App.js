import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RouterPath from './Router'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {debug, debug2, debugJSON} from './service/misc'

/**
 *  The main react entry point configures the theme and creates the basic React component called App
 **/
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
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

//Props is the angular $scope.props
//ES6 shorthand
export const App = (props) => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <RouterPath props={props}/>
    </MuiThemeProvider>
)

module.exports = {App:App}
exports.default = App
