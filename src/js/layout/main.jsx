import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Navigation from '../widget/navigation'
import Search from '../widget/search'
import Subheader from 'material-ui/Subheader'
import { RaisedButton, Divider } from 'material-ui'
import HamburgerMenu from 'react-hamburger-menu'
import {ngScope,reduxConnect,myAsyncFormConnect} from '../service/bridge'
import MyComponent, {Catch} from '../widget/common'
import { Switch,Route } from 'react-router-dom'
import * as router from '../Router.jsx'
import Login from '../pages/login.jsx'

//@myAsyncFormConnect()
@reduxConnect()
export default class MainLayout extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
        this.state = {open: props.open}
    }

    render() {
        let currentRouteName = this.props.location.pathname
        const {open}= this.state
        return (
            <div>
                <Catch>
                    <Navigation ref={(obj) => { this.nav = obj; }} open={open}/>
                        <div>
                            <HamburgerMenu
                                isOpen={open}
                                menuClicked={this.handleClick.bind(this)}
                                width={28}
                                height={25}
                                strokeWidth={5}
                                rotate={0}
                                color='red'
                                borderRadius={0}
                                animationDuration={1.5}
                            />
                            <span>{currentRouteName}</span>
                        </div>
                </Catch>
            </div>)
    }

    handleClick(e) {
        this.setState({open: !this.state.open})
        this.nav.toggle()
    }

    static reduxPropsConfig = (state, props) => ({
        authId: state.login.id,
        open: state.open
    })

    static propTypes = {
        open: PropTypes.bool.isRequired,
        authId: PropTypes.number.isRequired
    }
    static defaultProps = {
        open: false,
        authId: -1
    }

    static reduxAsyncConfig = [{
        key: `main`,
        promise: ({ store,router}) => new Promise((resolve, reject)=> {
            const {login} = store.getState()
            if (login.id == -1) {
                alert('login')
                router.push(Router.LOGIN)
            }
            resolve({})
            return {}
        }).then((result) =>result).catch((e)=> {
            console.log(e)
            throw e
        })
    }]

}


