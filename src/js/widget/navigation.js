import React, {Component} from 'react'
import PropTypes from 'prop-types';

import { Drawer, MenuItem, RaisedButton, List, ListItem, Divider } from 'material-ui'
import { Link } from 'react-router'
import * as router from '../Router.jsx'

const MIN = 300
export default class Navigation extends React.Component {
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

    handleToggle = () => {
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
                <Drawer open={this.state.open} openSecondary={true}>
                    <div className="main-logo">
                        <Link to="/"><span className="type-italic">Home</span></Link>
                    </div>
                    <List>
                        <ListItem primaryText="Add Ride"
                                  containerElement={<Link activeClassName="active" to={router.EDITRIDE} />}/>
                        <ListItem primaryText="Rides"
                                  containerElement={<Link activeClassName="active" to={router.RIDES} />}/>
                        <ListItem primaryText="Groups"
                                  containerElement={<Link activeClassName="active" to={router.GROUPS} />}/>
                        <ListItem primaryText="Messages"
                                  containerElement={<Link activeClassName="active" to={router.MESSAGES} />}/>
                        <ListItem primaryText="Settings"
                                  containerElement={<Link activeClassName="active" to={router.SETTINGS} />}/>
                        <ListItem primaryText="Route"
                                  containerElement={<Link activeClassName="active" to={router.ROUTE} />}/>
                        <ListItem primaryText="Login"
                                  containerElement={<Link activeClassName="active" to={router.LOGIN} />}/>
                        <ListItem primaryText="Logout"
                                  containerElement={<Link activeClassName="active" to={router.LOGOUT} />}/>
                        <ListItem primaryText="Terms"
                                  containerElement={<Link activeClassName="active" to={router.TERMS} />}/>
                        <ListItem primaryText="About"
                                  containerElement={<Link activeClassName="active" to={router.ABOUT} />}/>
                    </List>
                    <Divider />
                    <RaisedButton label="Hide" onClick={this.hide.bind(this)}/>
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