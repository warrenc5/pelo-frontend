import React, {Component,PropTypes} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import $ from 'jquery'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {debug, debug2, debugJSON} from './service/misc'
import RouterPath from './Router.jsx'

import {createTestData}  from './TestData'
import MyReducer from './handler/reducers'
import {myTheme} from './layout/theme'
import ngScope from './service/bridge'

/**
 *  The main react entry point configures the theme and creates the basic React component called App
 **/


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

class App extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
        ngScope().initializeStorage()

        //LOAD TEST DATA
        $.extend(this.props.state, createTestData());
        //debug2(JSON.stringify(this.props.state))

        this.store = createStore(MyReducer(), this.props.state);

        /*
        this.store.subscribe((state = [], dispatch) => {
            debug2("sub " + JSON.stringify(state))
        })
        */
    }

    render() {
        return <MuiThemeProvider muiTheme={myTheme}>
            <Provider store={this.store}>
                <RouterPath props={this.props}/>
            </Provider>
        </MuiThemeProvider>
    }
}

module.exports = {App: App}
exports.default = App

App.propTypes = {
    //Props is linked the angular $scope.state
    state: PropTypes.object.isRequired,
}
