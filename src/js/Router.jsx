import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {ReduxAsyncConnect} from 'redux-connect'
import {ConnectedRouter} from 'react-router-redux'
import MainLayout from './layout/main.jsx'
import ContentLayout from './layout/content.jsx'
import HomeContainer from './pages/home.jsx'
import Groups from './pages/groups.jsx'
import MessagesContainer from './pages/messages.jsx'
import Rides from './pages/rides.jsx'
import SettingsContainer from './pages/settings.jsx'
import Login from './pages/login.jsx'
import Logout from './pages/logout.jsx'
import Register from './pages/register.jsx'
import RideEditor from './pages/editRide.jsx'
import About from './pages/about.jsx'
import Terms from './pages/terms.jsx'
import MyRouteMap from './widget/routemap'
import {ngScope} from './service/bridge'
import MyComponent,{myAsyncFormConnect,Catch} from './widget/common.js'
import { Router } from 'react-router'
import { Switch,Route, Redirect} from 'react-router-dom'
import { applyMiddleware } from 'redux'
import * as select from './handler/selectors'
/**
 * This screen transition logical router handles html a links and anchor refs in the app
 *
 * When it's first rendered it displays the IndexRoute component.
 *
 * Currently all the Links are in component/navigation.js
 **/


@myAsyncFormConnect()
export default class RouterPath extends MyComponent {

    constructor(props, context) {
        super(props, context)
        this.props = props
    }

    render() {
        // Does the environment support HTML 5 history
        const supportsHistory = typeof window !== 'undefined' && 'pushState' in window.history;
        const {signedIn}  = this.props
        //const {signedIn}  = true
        return (
            <ConnectedRouter history={this.props.history} ref={(obj) => { this.router = obj; }}>
                <Catch>
                    <Route path={routes.ABOUT} component={About} pageTitle="About"/>
                    <Route path={routes.ROOT} component={MainLayout}/>
                    <Switch>
                        <Route path={routes.TERMS} component={Terms} pageTitle="T &amp; C"/>
                        <Redirect exact from={routes.ROOT} to={this.props.defaultPath}/>
                        <Redirect exact from={routes.HOME} to={this.props.defaultPath}/>
                        <Route path={routes.LOGOUT} component={Logout} pageTitle="Logout"/>
                        <Route path={routes.ERROR} component={Logout} pageTitle="Error"/>
                        <AsyncRoute exact path={routes.LOGIN} component={Login} pageTitle="Sign In"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.EDITRIDE} component={RideEditor} pageTitle="Edit Ride"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.RIDES} component={Rides} pageTitle="Rides"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.REGISTER} component={Register} pageTitle="Sign Up"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.GROUPS} component={Groups} pageTitle="Groups"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.MESSAGES} component={MessagesContainer} pageTitle="Messages"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.SETTINGS} component={SettingsContainer} pageTitle="Settings"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.ROUTE} component={MyRouteMap} pageTitle="Route"/>
                        <PrivateRoute exact signedIn={signedIn} path={routes.ABOUT} component={About} pageTitle="About"/>
                    </Switch>
                    <Route children={
                    <Catch>
                        <hr/>
                        <div>
                            {this.props.signedIn?<span>user id: {this.props.authId}</span>:<span>No user</span>}
                            <br/>
                            <span>build time: {this.props.buildTime}</span><br/>
                            <span>server: {this.props.baseUrl}</span><br/>
                            <span>device: {`${this.props.device.platform} ${this.props.device.version} ${this.props.device.model}` }</span><br/>
                            <span>default: {this.props.defaultPath} </span>
                        </div>
                    </Catch>
                    }/>
                </Catch>
            </ConnectedRouter>
        )
    }

    getRouteComponent() {
        switch (this.props.defaultPath) {

        }
    }

    onEnter(location, replaceWith, callback) {
        console.log(`save:  ${location}`)
        callback()
    }

    static propTypes = {
        signedIn: PropTypes.bool.isRequired,
        buildTime: PropTypes.string.isRequired,
        baseUrl: PropTypes.string.isRequired,
        authId: PropTypes.number.isRequired,
        defaultPath: PropTypes.string.isRequired,
        device: PropTypes.object.isRequired,
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: (select.authIdSelector(state) > 0),
        buildTime: select.buildTimeSelector(state),
        baseUrl: ngScope().state.baseUrl,
        device: ngScope().state.device,
        authId: select.authIdSelector(state),
        defaultPath: select.defaultPath(state)
    })

    static reduxDispatchConfig = (dispatch) => ({})
}

// reload only when path/route has changed
const reloadOnPropsChange = (props, nextProps) => {
    return props.location.pathname !== nextProps.location.pathname;
}

export class RouteCatch extends MyComponent {
    render() {
        const {component:Component, ... rest} = this.props
        const isError = super.isError()
        return <Route {... rest} render={props => (
            isError?
               <Redirect to={{
                    pathname: routes.ERROR,
                  }}/>
            : <Component {...props} />
            )}/>
    }
}

const Rac = ({component,...props})=>
    <ReduxAsyncConnect {... props}
        components={[component]} reloadOnPropsChange={reloadOnPropsChange}
        render={props=>(<RouteCatch component={component}/>)}
    />

const AsyncRoute = ({component, ...props}) => (
    <Route {...props} render={props => <Rac component={component} {... props} />}/>
)

const PrivateRoute = ({signedIn, location,component, ...props}) => (
    <Route {...props} render={props => (
    signedIn?(<Rac component={component} {... props}/>) :
    (<Redirect to={{
        pathname: routes.LOGIN,
        state: { from: location }
      }}/>
    )
  )}/>
)

export class routes {
static ROOT = '/'
static LOGIN = '/login'
static ERROR = '/error'
static LOGOUT = '/logout'
static EDITRIDE = '/editRide'
static REGISTER = '/register'
static MESSAGES = '/messages'
static SETTINGS = '/settings'
static TERMS = '/terms'
static ROUTE = '/routes'
static GROUPS = '/groups'
static RIDES = '/rides'
static ABOUT = '/about'
static HOME = '/home'
}
