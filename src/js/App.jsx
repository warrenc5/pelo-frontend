import React, {Component} from 'react'
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
//import injectTapEventPlugin from 'react-tap-event-plugin'
import $ from 'jquery'
import { routerMiddleware } from 'react-router-redux'
//import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory,browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import RouterPath from './Router.jsx'
import {createTestData}  from './TestData'
import MyReducer from './handler/reducers'
import {myTheme} from './layout/theme'
import {debug, debug2, debugJSON} from './service/misc'
import {ngScope,myAsyncFormConnect} from './service/bridge'
/**
 *  The main react entry point configures the theme and creates the basic React component called App
 **/
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin()
/*
 https://medium.com/the-many/handling-android-back-button-events-in-react-native-with-custom-components-b33c63b0633b
 BackAndroid.addEventListener("hardwareBackPress", () => {
 if (navigator.getCurrentRoutes().length > 1) {
 navigator.pop()
 return true // do not exit app
 } else {
 return false // exit app
 }
 })
 */
export default class App extends Component {
    constructor(props) {
        super(props)
        this.props = props

        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.handleTouchTap = this.handleTouchTap.bind(this)

        ngScope().initializeStorage()

        //LOAD TEST DATA
        $.extend(this.props.state, createTestData());
        //debug2(JSON.stringify(this.props.state))

        //this.history = browserHistory
        this.history = hashHistory
        this.middle = [thunk, routerMiddleware(this.history)]
        //const middle = routerMiddleware(this.history)
        this.store = createStore(MyReducer(), this.props.state, applyMiddleware(... this.middle));

        /**
         * can't use this because of accessTokenCookie
         */
        this.store.dispatch(({
            type: `LOAD_TEST_DATA`,
            payload: {id: 17}
        }))
        /*
         syncHistoryWithStore(browserHistory, this.store, {
         //    selectLocationState: createSelectLocationState('routing'),
         });
         */

        /*
         this.store.subscribe((state = [], dispatch) => {
         debug2("sub " + JSON.stringify(state))
         })
         */

        //FIXME HOWTO??
        //window.scrollReveal = new scrollReveal();
        //TODO what does this do?
        this.state = {
            open: false,
        }
    }

    handleRequestClose() {
        this.setState({
            open: false,
        })
    }

    //TODO should move to material.js?
    handleTouchTap() {
        this.setState({
            open: true,
        })
    }
    componentDidMount() {
        document.getElementById('bg').class='hidden'
    }

    render() {
        return <MuiThemeProvider muiTheme={myTheme}>
            <Provider store={this.store} key="provider">
                <RouterPath middleware={this.middle} props={this.props} history={this.history}/>
            </Provider>
        </MuiThemeProvider>
    }

    static propTypes = {
        //Props is linked the angular $scope.state through the pelo-app directive in index.jade
        state: PropTypes.object.isRequired,
    }

    static reduxPropsConfig = (state, props) => ({})

    static reduxDispatchConfig = (dispatch) => ({})
}

