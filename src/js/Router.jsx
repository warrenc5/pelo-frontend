import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {ReduxAsyncConnect} from 'redux-connect'
import {ConnectedRouter} from 'react-router-redux'
import RouteDispatcher from 'react-router-dispatcher'
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
import MyComponent,{myAsyncFormConnect,Catch} from './widget/common.js'
import { Switch,Route, Redirect} from 'react-router-dom'
import { applyMiddleware } from 'redux'

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
    }

//<Router history={hashHistory}>
//<ConnectedRouter render={(props) => <ReduxAsyncConnect {...props} /> } history={this.props.history}>
    //render={ (props) => <ReduxAsyncConnect reloadOnPropsChange={super.reloadOnPropsChange} {...props} /> }
//<Router render={(props) => <ReduxAsyncConnect {...props} /> } history={browserHistory}>
    //render={applyRouterMiddleware()}

//<Router render={(props) => <ReduxAsyncConnect {...props} /> } history={this.props.history}>
    //
//<ReduxAsyncConnect helpers={applyRouterMiddleware(this.props.middle)} reloadOnPropsChange={super.reloadOnPropsChange} {...props}  history={this.props.history}/> }
    render() {
        // Does the environment support HTML 5 history
        const supportsHistory = typeof window !== 'undefined' && 'pushState' in window.history;

        return (
            <ConnectedRouter render={(props) =>
                <ReduxAsyncConnect reloadOnPropsChange={super.reloadOnPropsChange} history={this.props.history} {...props} /> }
                             forceRefresh={!supportsHistory} history={this.props.history}>
                <Catch>
                    <Route path={TERMS} component={Terms} pageTitle="T &amp; C"/>
                    <Route path={ABOUT} component={About}/>
                    <Redirect exact from={ROOT} to={HOME}/>
                    <Route path={ROOT} component={MainLayout}/>
                    <Switch>
                        <Route path={LOGOUT} component={Logout} pageTitle="Logout"/>
                        <Route exact path={LOGIN} component={Login} pageTitle="Sign In"/>
                        <PrivateRoute signedIn={this.props.signedIn} path={EDITRIDE} component={RideEditor} pageTitle="Edit Ride"/>
                        <PrivateRoute signedIn={this.props.signedIn} path={RIDES} component={Rides} pageTitle="Rides" onEnter={this.onEnter}/>
                    </Switch>
                </Catch>
            </ConnectedRouter>

        )
    }

    /**
     <Route component={ContentLayout}>
     <Route path={REGISTER} component={Register} pageTitle="Sign Up"/>
     <Route path={GROUPS} component={Groups} pageTitle="Groups" onEnter={this.onEnter}/>
     <Route path={MESSAGES} component={MessagesContainer} pageTitle="Messages"/>
     <Route path={SETTINGS} component={SettingsContainer} pageTitle="Settings"/>
     <Route path={ROUTE} component={MyRouteMap} pageTitle="Route"/>
     <IndexRoute component={Login}/>
     </Route>
     **/

    onEnter(location, replaceWith, callback) {
        console.log(`save:  ${location}`)
        callback()
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    static propTypes = {
        signedIn: PropTypes.bool.isRequired,
    }

    static reduxPropsConfig = (state, props) => ({
      signedIn: (state.login !=null && state.login.id >0)
    })

    static reduxDispatchConfig = (dispatch) => ({
    })
}


const PrivateRoute = ({ signedIn, component: Component, ...rest }) => (
    <Route {...rest} render={props => (
    signedIn?(
    <div>
    <span>{signedIn}</span>
      <Component {...props}/>
      </div>
    ) : (
      <Redirect to={{
        pathname: LOGIN,
        state: { from: props.location }
      }}/>
    )
  )}/>
)

//export const Index = Rides
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
export const RIDES = 'rides'
export const ABOUT = '/about'
export const HOME = EDITRIDE
export const Index = Rides
//export const HOME = GROUPS
