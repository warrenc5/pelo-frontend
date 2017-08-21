import React from 'react'
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router'
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
import { ConnectedRouter } from 'react-router-redux'
import { BrowserHistory } from 'react-history'

import MainLayout from './layout/main.jsx'
import ContentLayout from './layout/content.jsx'
import HomeContainer from './pages/home.jsx'
import Groups from './pages/groups.jsx'
import MessagesContainer from './pages/messages.jsx'
import Rides from './pages/rides.jsx'
import SettingsContainer from './pages/settings.jsx'
import Login from './pages/login.jsx'
import BikeComponent from './pages/bike.jsx'
import Register from './pages/register.jsx'
import RideEditor from './pages/editRide.jsx'
import About from './pages/about.jsx'
import Terms from './pages/terms.jsx'
import MyRouteMap from './widget/routemap'
import MyComponent from './widget/common'

/**
 * This screen transition logical router handles html a links and anchor refs in the app
 *
 * When it's first rendered it displays the IndexRoute component.
 *
 * Currently all the Links are in component/navigation.js
 **/

export default class RouterPath extends MyComponent {

    constructor(props, context) {
        super(props, context)
    }

//<Router history={hashHistory}>
//<ConnectedRouter render={(props) => <ReduxAsyncConnect {...props} /> } history={this.props.history}>
//<Router render={(props) => <ReduxAsyncConnect {...props} /> } history={browserHistory}>
    //render={applyRouterMiddleware()}

    render() {
        return (
            <Router
                render={(props) => <ReduxAsyncConnect helpers={{ }} reloadOnPropsChange={super.reloadOnPropsChange} {...props}
                /> }
                history={this.props.history}>
                <Route visible="true" path="/" component={MainLayout}>
                    <Route component={ContentLayout}>
                        <Route path={LOGIN} component={Login} pageTitle="Sign In"/>
                        <Route path={REGISTER} component={Register} pageTitle="Sign Up"/>
                        <Route path={EDITRIDE} component={RideEditor} pageTitle="Edit Ride"/>
                        <Route path={RIDES} component={Rides} pageTitle="Rides" onEnter={this.onEnter}/>
                        <Route path={GROUPS} component={Groups} pageTitle="Groups" onEnter={this.onEnter}/>
                        <Route path={MESSAGES} component={MessagesContainer} pageTitle="Messages"/>
                        <Route path={SETTINGS} component={SettingsContainer} pageTitle="Settings"/>
                        <Route path={TERMS} component={Terms} pageTitle="T &amp; C"/>
                        <Route path={ROUTE} component={MyRouteMap} pageTitle="Route"/>
                        <Route path={ABOUT} component={About}/>
                    </Route>
                    <Route component={ContentLayout}>
                        <IndexRoute component={Index}/>
                    </Route>
                </Route>
            </Router>
        )
    }

    onEnter(location, replaceWith, callback) {
        console.log(`save:  ${location}`)
        callback()
    }

    static propTypes = {
    }
}

//export const Index = Rides
export const Index = Login
export const LOGIN = '/login'
export const EDITRIDE = '/editRide'
export const REGISTER = '/register'
export const MESSAGES = '/messages'
export const SETTINGS = '/settings'
export const TERMS = '/terms'
export const ROUTE = '/routes'
export const GROUPS = '/groups'
export const RIDES = '/rides'
export const ABOUT = '/about'


