import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Navigation from '../widget/navigation'
import Search from '../widget/search'
import Subheader from 'material-ui/Subheader'
import { RaisedButton, Divider } from 'material-ui'
import HamburgerMenu from 'react-hamburger-menu'
import {ngScope,reduxConnect,myAsyncFormConnect} from '../service/bridge'
import MyComponent from '../widget/common'

//@myAsyncFormConnect()
@reduxConnect()
export default class MainLayout extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
        this.state = props
    }

    render() {
        let currentRouteName = this.props.location.pathname
        return (
            <div>
                <Navigation ref={(obj) => { this.nav = obj; }} open={this.props.open}/>
                <div id="main-wrapper" className="main-wrapper">
                    <div>
                        {this.props.authId > 0  &&
                        <HamburgerMenu
                            isOpen={this.props.open}
                            menuClicked={this.handleClick.bind(this)}
                            width={28}
                            height={25}
                            strokeWidth={5}
                            rotate={0}
                            color='red'
                            borderRadius={0}
                            animationDuration={1.5}
                        />
                            }
                    </div>
                    <div className="main-content-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

    handleClick(e) {
        this.setState({open: !this.props.open})
        this.nav.toggle()
    }

    static reduxPropsConfig = (state, props) => ({
        authId: state.login.id
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


