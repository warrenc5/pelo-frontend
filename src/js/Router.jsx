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
        return (
            <ConnectedRouter history={this.props.history} ref={(obj) => { this.router = obj; }} >
                <Catch>
                    <Route path={ABOUT} component={About}/>
                    <Route path={ROOT} component={MainLayout}/>
                    <Switch>
                        <Route path={TERMS} component={Terms} pageTitle="T &amp; C"/>
                        <Redirect exact from={ROOT} to={HOME}/>
                        <Route path={LOGOUT} component={Logout} pageTitle="Logout"/>
                        <AsyncRoute exact router={this.router} path={LOGIN} component={Login} pageTitle="Sign In"/>
                        <PrivateRoute signedIn={signedIn} path={EDITRIDE} component={RideEditor} pageTitle="Edit Ride"/>
                        <PrivateRoute signedIn={signedIn} path={RIDES} component={Rides} pageTitle="Rides"/>
                        <PrivateRoute signedIn={signedIn} path={REGISTER} component={Register} pageTitle="Sign Up"/>
                        <PrivateRoute signedIn={signedIn} path={GROUPS} component={Groups} pageTitle="Groups"/>
                        <PrivateRoute signedIn={signedIn} path={MESSAGES} component={MessagesContainer}
                                      pageTitle="Messages"/>
                        <PrivateRoute signedIn={signedIn} path={SETTINGS} component={SettingsContainer}
                                      pageTitle="Settings"/>
                        <PrivateRoute signedIn={signedIn} path={ROUTE} component={MyRouteMap} pageTitle="Route"/>
                        <PrivateRoute path={ABOUT} component={About}/>

                    </Switch>
                    <Route children={
                    <Catch>
                        <hr/>
                        <div>
                            {this.props.signedIn?<span>user id: {this.props.authId}</span>:<span>nada</span>}
                            <br/>

                            <span>build time: {this.props.buildTime}</span><br/>
                            <span>server: {this.props.baseUrl}</span>
                        </div>
                    </Catch>
                    }/>
                </Catch>
            </ConnectedRouter>
        )
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
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: (select.authIdSelector(state) > 0),
        buildTime: select.buildTimeSelector(state),
        baseUrl: ngScope().state.baseUrl,
        authId: select.authIdSelector(state)
    })

    static reduxDispatchConfig = (dispatch) => ({})
}

// reload only when path/route has changed
const reloadOnPropsChange = (props, nextProps) => {
    return props.location.pathname !== nextProps.location.pathname;
}

const Rac =(props)=>
        <ReduxAsyncConnect {... props}
            reloadOnPropsChange={reloadOnPropsChange}
        />
/**
 *
 render={props2=><Catch><Component2 {...props2} /></Catch>}
 * @param component
 * @param props
 * @constructor
 */

const AsyncRoute = ({component, ...props}) => (
    <Route {...props} render={props => <Rac component={component} {... props} />} />
)

//TODO: fix location redirect
const PrivateRoute = ({signedIn, location,component, ...props}) => (
    <Route {...props} render={props => (
    signedIn?(<Rac component={component} {... props}/>) :
    (<Redirect to={{
        pathname: LOGIN,
        state: { from: location }
      }}/>
    )
  )}/>
)

export const ROOT = '/'
export const LOGIN = '/login'
export const LOGOUT = '/logout'
export const EDITRIDE = '/editRide'
export const REGISTER = '/register'
export const MESSAGES = '/messages'
export const SETTINGS = '/settings'
export const TERMS = '/terms'
export const ROUTE = '/routes'
export const GROUPS = '/groups'
export const RIDES = '/rides'
export const ABOUT = '/about'
export const HOME = GROUPS
