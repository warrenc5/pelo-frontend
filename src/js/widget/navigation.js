import React from 'react'
import PropTypes from 'prop-types';

import { Drawer, MenuItem, RaisedButton, List, ListItem, Divider } from 'material-ui'
import { NavLink, Link } from 'react-router-dom'
import * as router from '../Router.jsx'

import MyComponent, {Catch} from '../widget/common'

const MIN = 300
export default class Navigation extends MyComponent {
    constructor(props) {
        super(props)
        this.state = {open: this.props.open}
    }

    show = () => {
        this.setState({open: true})
    }

    hide = () => {
        this.setState({open: false})
    }

    toggle = () => {
        this.setState({open: !this.state.open})
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
        return (
            <nav className="main-nav">
                <Drawer ref={(obj) => { this.nav = obj; }} open={this.state.open} openSecondary={true}>
                    <div className="main-logo">
                        <RaisedButton label="Hide" onClick={this.hide.bind(this)}/>
                        <NavLink to={router.HOME}><span className="type-italic">Home</span></NavLink>
                    </div>
                    <List>
                        <ListItem primaryText="Add Ride"
                                  containerElement={<NavLink activeClassName="active" to={router.EDITRIDE} />}/>
                        <ListItem primaryText="Rides"
                                  containerElement={<NavLink activeClassName="active" to={router.RIDES} />}/>
                        <ListItem primaryText="Groups"
                                  containerElement={<NavLink activeClassName="active" to={router.GROUPS} />}/>
                        <ListItem primaryText="Messages"
                                  containerElement={<NavLink activeClassName="active" to={router.MESSAGES} />}/>
                        <ListItem primaryText="Settings"
                                  containerElement={<NavLink activeClassName="active" to={router.SETTINGS} />}/>
                        <ListItem primaryText="Route"
                                  containerElement={<NavLink activeClassName="active" to={router.ROUTE} />}/>
                        <ListItem primaryText="Login"
                                  containerElement={<NavLink activeClassName="active" to={router.LOGIN} />}/>
                        <ListItem primaryText="Logout"
                                  containerElement={<NavLink activeClassName="active" to={router.LOGOUT} />}/>
                        <ListItem primaryText="Terms"
                                  containerElement={<NavLink activeClassName="active" to={router.TERMS} />}/>
                        <ListItem primaryText="About"
                                  containerElement={<NavLink activeClassName="active" to={router.ABOUT} />}/>
                    </List>
                    <Divider />
                    <RaisedButton label="Exit" onClick={this.exitApp.bind(this)}/>

                </Drawer>
            </nav>
        )
    }

    exitApp(e){

        navigator.notification.confirm('', confirmed, 'Exit?')
        navigator.app.exitApp()
    }


    static propTypes = {
        open: PropTypes.bool.isRequired
    }

    static defaultProps = {
        open: false
    }

}
/*
 <span class="dark" ng-click="showPage('rides');">rides</span>
 <span class="dark" ng-click="showPage('groups');">groups</span>
 <span class="dark" ng-click="showPage('messages');">messages</span>
 <span class="dark" ng-click="showPage('settings');">settings</span>
 <span class="dark" ng-click="logout();">logout</span>
 </nav>
 */