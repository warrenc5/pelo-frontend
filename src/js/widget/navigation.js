import React from 'react'
import PropTypes from 'prop-types';

import { Drawer, MenuItem, RaisedButton, List, ListItem, Divider } from 'material-ui'
import { NavLink, Link } from 'react-router-dom'
import {routes} from '../Router.jsx'

import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'
import {ngScope} from '../service/bridge'
const MIN = 300

@myAsyncFormConnect()
export default class Navigation extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
    }

    /**
     handleWindowResize = () => {
        if (window.innerWidth <= MIN && this.state.open === true) {
            this.setState({open: false})
        }
        else if (window.innerWidth > MIN && this.state.open === false) {
            this.setState({open: true})
        }
    }
     **/

    componentDidMount = () => {
        // this.handleWindowResize()
        //window.addEventListener('resize', this.handleWindowResize)
    }


    render() {
        const ListItemNavLink = (props) =>
            <ListItem primaryText={props.primaryText}
                      onClick={this.props.toggle.bind(this)}
                      containerElement={
                      <NavLink activeClassName={props.activeClassName} to={props.to}
                      />}/>

        return (
            <nav className="main-nav">
                <Drawer ref={(obj) => { this.nav = obj; }} open={this.props.open} openSecondary={true}>
                    <div className="main-logo">
                        <img class="round-image"
                             src={ngScope().state.baseUrl + `userimage/${this.props.login.id}`}/>
                        <ListItemNavLink primaryText="Pelo" to={routes.HOME}/>
                    </div>
                    <hr/>
                    <List>
                        <ListItemNavLink primaryText="Add Ride" to={routes.EDITRIDE}/>
                        <ListItemNavLink primaryText="Rides" to={routes.RIDES}/>
                        <ListItemNavLink primaryText="Groups" to={routes.GROUPS}/>
                        <ListItemNavLink primaryText="Messages" to={routes.MESSAGES}/>
                        <ListItemNavLink primaryText="Settings" to={routes.SETTINGS}/>
                        <ListItemNavLink primaryText="Route" to={routes.ROUTE}/>
                        <ListItemNavLink primaryText="Terms" to={routes.TERMS}/>
                        <ListItemNavLink primaryText="About" to={routes.ABOUT}/>
                        <ListItemNavLink primaryText="Logout" to={routes.LOGOUT}/>
                    </List>
                    <Divider />
                    <RaisedButton label="Exit" onClick={this.exitApp.bind(this)}/>
                </Drawer>
            </nav>
        )
    }

    exitApp(e) {

        //TODO:user reducer as event handler

        ngScope().platform.exitApp()
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        login: PropTypes.object.isRequired
    }
    static defaultProps = {
        open: false,
    }

    static reduxPropsConfig = (state, props) => ({
        open: state.main.open,
        login: state.login
    })
    static reduxDispatchConfig = (dispatch, props) => ({
        toggle: (event) => {
            dispatch({
                type: `HAMBURGER`,
            })
        }
    })


}
/*
 <span class="dark" ng-click="showPage('rides');">rides</span>
 <span class="dark" ng-click="showPage('groups');">groups</span>
 <span class="dark" ng-click="showPage('messages');">messages</span>
 <span class="dark" ng-click="showPage('settings');">settings</span>
 <span class="dark" ng-click="logout();">logout</span>
 </nav>
 */