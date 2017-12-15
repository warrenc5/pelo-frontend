import React from 'react'
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
//import injectTapEventPlugin from 'react-tap-event-plugin'
import $ from 'jquery'
import {syncHistoryWithStore} from 'react-router-redux';
//import RouteDispatcher from 'react-router-dispatcher';
import {Provider} from 'react-redux'
import {compose, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import RouterPath from './Router.jsx'
import {createTestData} from './TestData'
import MyReducer from './handler/reducers'
import {myTheme} from './layout/theme'

import {NgScope2} from './service/bridge'
import MyComponent, {Catch, myAsyncFormConnect} from './widget/common'
import createHashHistory from 'history/createHashHistory'
import {routerMiddleware as reactRouterReduxMiddleware, push} from 'react-router-redux'
//import { connectRouter, routerMiddleware as connectedRouterMiddleware} from 'connected-react-router'

//import {useRouterHistory} from 'react-router'
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
export default class App extends MyComponent {
    static NAME = 'Fail'

    constructor(props) {
        super(props)
        this.props = props

        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.handleTouchTap = this.handleTouchTap.bind(this)


        //LOAD TEST DATA

        //console.log(JSON.stringify(this.props.state))

        //this.history = useRouterHistory(createHashHistory());
        //this.history = HashHistory
        //console.log("history *** " + this.history)
        //this.middle =
        //const middle = routerMiddleware(this.history)

        this.history = createHashHistory();
        /*history = syncHistoryWithStore(this.history, this.store);/*, {

         //to move the name bound at
         selectLocationState: ()=>{console.log('ok')}
         });
         */
        this.middleware = applyMiddleware(... [
            ({getState}) => {
                return next => action => {
                    console.log(action.type, action.payload === undefined ? null : action.payload)
                    let returnValue = next(action)
                    console.log("state", getState())
                    return returnValue
                }
            },
            thunk, reactRouterReduxMiddleware(this.history)])

        this.store = createStore(
            MyReducer(),
            //window.__data,
            this.props.state,
            compose(
                this.middleware)
        )

        /**
         this.store.dispatch(({
            type: `LOAD_TEST_DATA`,
            payload: createTestData()
        }))
         **/


        /*
         this.store.subscribe((state = [], dispatch) => {
         console.log("sub " + JSON.stringify(state))
         })
         */

        //FIXME HOWTO??
        //window.scrollReveal = new scrollReveal();
        //TODO what does this do?
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
        document.getElementById('bg').class = 'hidden'
    }

    renderError() {
        return <span>{this.NAME} Fail</span>
    }

    render() {
        return super.isError() ? this.renderError() :
            <MuiThemeProvider muiTheme={myTheme}>
                <Provider store={this.store} key="provider">
                    <NgScope2>
                        <RouterPath middleware={this.middleware} history={this.history}/>
                    </NgScope2>
                </Provider>
            </MuiThemeProvider>
    }

    static propTypes = {
        //Props is linked the angular $scope.state through the pelo-app directive in index.jade
        state: PropTypes.object.isRequired,
    }
}

