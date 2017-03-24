import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router'
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
import { ConnectedRouter } from 'react-router-redux'
import { BrowserHistory } from 'react-history'

import MainLayout from './layout/main.jsx'
import ContentLayout from './layout/content.jsx'
import HomeContainer from './pages/home.jsx'
import GroupsContainer from './pages/groups.jsx'
import MessagesContainer from './pages/messages.jsx'
import RidesContainer from './pages/rides.jsx'
import SettingsContainer from './pages/settings.jsx'
import LoginContainer from './pages/login.jsx'
import BikeComponent from './pages/bike.jsx'
import RegisterContainer from './pages/register.jsx'
import About from './pages/about.jsx'
import Terms from './pages/terms.jsx'

let onUpdate = () => {
    window.scrollTo(0, 0)
}

/**
 * This screen transition logical router handles html a links and anchor refs in the app
 *
 * When it's first rendered it displays the IndexRoute component.
 *
 * Currently all the Links are in component/navigation.js
 **/

export default class RouterPath extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

//<Router history={hashHistory}>
//<ConnectedRouter render={(props) => <ReduxAsyncConnect {...props} /> } history={this.props.history}>
//<Router render={(props) => <ReduxAsyncConnect {...props} /> } history={browserHistory}>
    //render={applyRouterMiddleware()}

    reloadOnPropsChange = (props, nextProps) => {
        // reload only when path/route has changed
        return props.location.pathname !== nextProps.location.pathname;

    }

    render() {
        return (
            <Router render={(props) => <ReduxAsyncConnect helpers={{ }} reloadOnPropsChange={this.reloadOnPropsChange} {...props} /> }
                    history={this.props.history}>
                <Route path="/" component={MainLayout}>
                    <Route component={ContentLayout}>
                        <IndexRoute component={LoginContainer}/>
                    </Route>
                    <Route component={ContentLayout}>
                        <Route path="/bike-component" component={BikeComponent} pageTitle={this.props.DB_VERSION}/>
                        <Route path="/bike-component/:componentType" component={BikeComponent}
                               pageTitle="{:componentType}"/>
                        <Route path="/login" component={LoginContainer} pageTitle="{:componentType}"
                               onEnter={(location, replaceWith) => {
                                    console.log(`enter:  ${location}`)
                                    //return location
                                   }}
                               onLeave={() => {console.log('bye')}}
                        />
                        <Route path="/register" component={RegisterContainer} pageTitle="{:componentType}"/>
                        <Route path="/rides" component={RidesContainer} pageTitle="{:componentType}"/>
                        <Route path="/groups" component={GroupsContainer} pageTitle="{:componentType}"/>
                        <Route path="/messages" component={MessagesContainer} pageTitle="{:componentType}"/>
                        <Route path="/settings" component={SettingsContainer} pageTitle="{:componentType}"/>
                        <Route path="/terms" component={Terms} pageTitle="{:componentType}"/>
                    </Route>
                    <Route path="/about" component={About}/>
                </Route>
            </Router>
        )
    }
}
