import React, {Component,PropTypes} from 'react'
import { Drawer, MenuItem, RaisedButton, List, ListItem, Divider } from 'material-ui'
import { Link } from 'react-router'

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
            //TODO: can't see this on mobile emulator
            <nav className="main-nav">
                <Drawer open={this.state.open} openSecondary={true}>
                    <div className="main-logo">
                        <Link to="/"><span className="type-italic">Main</span></Link>
                    </div>
                    <List>
                        <ListItem primaryText="Home" containerElement={<Link activeClassName="active" to="/" />}/>
                        <ListItem primaryText="Rides" containerElement={<Link activeClassName="active" to="/rides" />}/>
                        <ListItem primaryText="Groups"
                                  containerElement={<Link activeClassName="active" to="/groups" />}/>
                        <ListItem primaryText="Messages"
                                  containerElement={<Link activeClassName="active" to="/messages" />}/>
                        <ListItem primaryText="Settings"
                                  containerElement={<Link activeClassName="active" to="/settings" />}/>
                        <ListItem primaryText="Login"
                                  containerElement={<Link activeClassName="active" to="/login" />}/>
                        <ListItem primaryText="Route"
                                  containerElement={<Link activeClassName="active" to="/route" />}/>
                    </List>
                    <Divider />
                    <RaisedButton label="Hide" onClick={this.hide.bind(this)}/>
                    <RaisedButton label="Exit" onClick={this.exitApp.bind(this)}/>

                </Drawer>
            </nav>
        )
    }

    exitApp(e){
       alert('exit not yet handled')
    }


    static propTypes = {
        open: PropTypes.bool.isRequired,
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