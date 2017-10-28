import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Navigation from '../widget/navigation'
import Search from '../widget/search'
import Subheader from 'material-ui/Subheader'
import { RaisedButton, Divider } from 'material-ui'
import HamburgerMenu from 'react-hamburger-menu'
import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'
import { Switch,Route } from 'react-router-dom'
import * as router from '../Router.jsx'

@myAsyncFormConnect()
export default class MainLayout extends MyComponent {
    static NAME = "MainLayout"

    constructor(props) {
        super(props)
        this.props = props
    }

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps)
        this.setState({open: nextProps.open})
    }

    render() {
        let currentRouteName = this.props.location.pathname
        const {open} = this.state
        return (
            <div>
                -{this.props.signedIn}-
                {this.props.signedIn && currentRouteName!='/Login'?(
                <Catch>
                    <Navigation ref={(obj) => { this.nav = obj; }} open={open}/>
                    <div>
                        <span>{currentRouteName}</span>
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
                    </div>
                </Catch>
                    ):(
                <span>..</span>)}
            </div>)
    }

    handleClick(e) {
        this.setState({open: !this.state.open})
        this.nav.toggle()
    }


    static propTypes = {
        open: PropTypes.bool.isRequired,
        signedIn: PropTypes.bool.isRequired,
    }
    static defaultProps = {
        open: false,
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: state.login != null && state.login.id >0,
        open: state.open
    })

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


