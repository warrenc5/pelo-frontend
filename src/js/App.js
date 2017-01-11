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
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import actions from './model/actions'
import filters from './model/filters'
import {MyReducer} from './model/reducers'

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

 if (typeof MyReducer !== 'function') {
    throw new Error('222Expected the reducer to be a function.');

  }
let store = createStore(MyReducer)

//Props is the angular $scope.props
//ES6 shorthand
export const App = (props) => (
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <RouterPath props={props}/>
        </MuiThemeProvider>
    </Provider>
)

module.exports = {App:App}
exports.default = App
