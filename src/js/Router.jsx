import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router'

import MainLayout from './layout/main.jsx'
import ContentLayout from './layout/content.jsx'
import HomeContainer from './pages/home.jsx'
import GroupsContainer from './pages/groups.jsx'
import MessagesContainer from './pages/messages.jsx'
import RidesContainer from './pages/rides.jsx'
import SettingsContainer from './pages/settings.jsx'
import LoginContainer from './pages/login.jsx'
import BikeComponent from './pages/bike.jsx'
import About from './pages/about.jsx'

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

    render() {
        return (
            <div>
                <Router history={hashHistory}>
                    <Route path="/" component={MainLayout}>
                        <IndexRoute component={GroupsContainer}/>
                        <Route component={ContentLayout}>
                            <Route path="/bike-component" component={BikeComponent} pageTitle={this.props.DB_VERSION}/>
                            <Route path="/bike-component/:componentType" component={BikeComponent} pageTitle="{:componentType}"/>
                            <Route path="/login" component={LoginContainer} pageTitle="{:componentType}"/>
                            <Route path="/rides" component={RidesContainer} pageTitle="{:componentType}"/>
                            <Route path="/groups" component={GroupsContainer} pageTitle="{:componentType}"/>
                            <Route path="/messages" component={MessagesContainer} pageTitle="{:componentType}"/>
                            <Route path="/settings" component={SettingsContainer} pageTitle="{:componentType}"/>
                        </Route>
                        <Route path="/about" component={About}/>
                    </Route>
                </Router>
            </div>
        )
    }
}