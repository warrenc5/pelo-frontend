import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router'

import MainLayout from './layout/mainlayout'
import ContentLayout from './layout/contentlayout'
import Home from './pages/home'
import {HomeContainer} from './model/containers'
import BikeComponent from './pages/bikecomponent'
import About from './pages/about'

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
                        <IndexRoute component={HomeContainer}/>
                        <Route component={ContentLayout}>
                            <Route path="/bike-component" component={BikeComponent} pageTitle={this.props.DB_VERSION}/>
                            <Route path="/bike-component/:componentType" component={BikeComponent}
                                   pageTitle="{:componentType}"/>
                        </Route>
                        <Route path="/about" component={About}/>
                    </Route>
                </Router>
            </div>
        )
    }
}
