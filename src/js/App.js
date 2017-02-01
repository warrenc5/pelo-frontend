import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RouterPath from './Router'
//import injectTapEventPlugin from 'react-tap-event-plugin'

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
//injectTapEventPlugin()


const store2 = createStore(MyReducer, {todaysRides: {id: true}})


//store2.subscribe((state = []) => {
/*store2.subscribe((state = [], dispatch) => {
    debug2("sub " + JSON.stringify(state))
})
*/

//Props is the angular $scope.props
//ES6 shorthand
const LOAD="LOAD"
class App extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
        ///store2.dispatch({type: LOAD, payload: {data: this.props}})
    }

    render() {
        return <MuiThemeProvider muiTheme={muiTheme}>
            <Provider store={store2}>
                <RouterPath props={this.props}/>
            </Provider>
        </MuiThemeProvider>
    }
}

module.exports = {App: App}
exports.default = App
