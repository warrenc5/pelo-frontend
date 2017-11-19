import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {ReduxAsyncConnect} from 'redux-connect'
import {ConnectedRouter} from 'react-router-redux'
//import RouteDispatcher from 'react-router-dispatcher'
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
import { Router,Switch,Route, Redirect} from 'react-router-dom'
import { applyMiddleware } from 'redux'
//import { ConnectedRouter } from 'connected-react-router' <--old
import * as select from './handler/selectors'
/**
 * This screen transition logical router handles html a links and anchor refs in the app
 *
 * When it's first rendered it displays the IndexRoute component.
 *
 * Currently all the Links are in component/navigation.js
 **/

const reloadOnPropsChange = (props, nextProps) => {
    alert("totally cool")
        return props.location.pathname !== nextProps.location.pathname;
    };

@myAsyncFormConnect()
export default class RouterPath extends MyComponent {

    constructor(props, context) {
        super(props, context)
        this.props = props
    }
// reload only when path/route has changed
/*
 render={this.props.middleware}

 */
    render() {
        // Does the environment support HTML 5 history
        const supportsHistory = typeof window !== 'undefined' && 'pushState' in window.history;
        //const {signedIn}  = this.props
        const signedIn = true
        Router.prototype.render =(props)=> <ReduxAsyncConnect {...this.props} reloadOnPropsChange={reloadOnPropsChange} />
        return (
            <Router {... this.props}>

                <Catch>
                    <Route path={TERMS} component={Terms} pageTitle="T &amp; C"/>
                    <Route path={ABOUT} component={About}/>
                    <Route path={ROOT} component={MainLayout}/>
                    <Switch>
                        <Redirect exact from={ROOT} to={HOME}/>
                        <Route path={LOGOUT} component={Logout} pageTitle="Logout"/>
                        <Route exact path={LOGIN} component={Login} pageTitle="Sign In"/>
                        <PrivateRoute signedIn={signedIn} path={EDITRIDE} component={RideEditor} pageTitle="Edit Ride"/>
                        <PrivateRoute signedIn={signedIn} path={RIDES} component={Rides} pageTitle="Rides"/>
                        <PrivateRoute signedIn={signedIn} path={REGISTER} component={Register} pageTitle="Sign Up"/>
                        <PrivateRoute signedIn={signedIn} path={GROUPS} component={Groups} pageTitle="Groups"/>
                        <PrivateRoute signedIn={signedIn} path={MESSAGES} component={MessagesContainer}
                                      pageTitle="Messages"/>
                        <PrivateRoute signedIn={signedIn} path={SETTINGS} component={SettingsContainer}
                                      pageTitle="Settings"/>
                        <PrivateRoute signedIn={signedIn} path={ROUTE} component={MyRouteMap} pageTitle="Route"/>
                        <Route children={
                        <Catch>
                            <div>
                                <span>user id: {this.props.authId}</span><br/>
                                <span>build time: {this.props.buildTime}</span><br/>
                                <span>server: {this.props.baseUrl}</span>
                            </div>
                        </Catch>
                        }/>
                    </Switch>
                </Catch>
            </Router>
        )
    }

    onEnter(location, replaceWith, callback) {
        console.log(`save:  ${location}`)
        callback()
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
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
const PrivateRoute = ({ signedIn, component: Component, ...rest }) => (
    <Route {...rest} render={props => (
    signedIn?(
      <Component {...props}/>
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
export const RIDES = '/rides'
export const ABOUT = '/about'
export const HOME = RIDES
export const Index = Rides
//export const HOME = GROUPS
//<Router history={hashHistory}>
//<ConnectedRouter render={(props) => <ReduxAsyncConnect {...props} /> } history={this.props.history}>
//render={ (props) => <ReduxAsyncConnect reloadOnPropsChange={super.reloadOnPropsChange} {...props} /> }
//<Router render={(props) => <ReduxAsyncConnect {...props} /> } history={browserHistory}>
//render={applyRouterMiddleware()}

//<Router render={(props) => <ReduxAsyncConnect {...props} /> } history={this.props.history}>
//
//<ReduxAsyncConnect helpers={applyRouterMiddleware(this.props.middle)} reloadOnPropsChange={super.reloadOnPropsChange} {...props}  history={this.props.history}/> }
/***
 * children={
                        <ReduxAsyncConnect {... this.props} router={this.router} history={history} children={
                    this.props.children
                        }>
                    </ReduxAsyncConnect>
 */
/*
 render={props=>(
 <ReduxAsyncConnect {... context} router={this.router} history={history}
 />
 )
 context={context}
 children={
 <ReduxAsyncConnect props={this.props} router={this.router} history={history} children={
 this.props.children
 }>
 </ReduxAsyncConnect>
 }

 */
class CustomRouter extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        const {middleware,history, children, component: Component} = this.props
        const context={}
        /*
        return <ConnectedRouter context={context} history={history} children={
            <ReduxAsyncConnect {...context} reloadOnPropsChange={super.reloadOnPropsChange} children={children}/>
            }/>
            */

        return    <Router
            history={history}
            children={children}
            />

    }
}
            /*
             return (
             <ConnectedRouter ref={(obj) => { this.router = obj;  console.log(obj)}}
             history={history}
             render={
             <ReduxAsyncConnect history={history}
             children={children}
             />
             }
             />
             )
             */
/*
 const CustomRouter = ({history, ...rest }) => (
 <Router ref={(obj) => { router = obj; }} history={history}
 render={<ReduxAsyncConnect {... router!=null?router.props:null} history={history}/>} >
 <Component {...props}/>
 </Router>
 )
 */
