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
import * as select from '../handler/selectors'


@myAsyncFormConnect()
export default class MainLayout extends MyComponent {
    static NAME = "MainLayout"

    constructor(props) {
        super(props)
        this.props = props
    }

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps)
    }

    render() {
        let currentRouteName = this.props.location.pathname
        const {open} = this.props
        return (
            <div>
                {this.props.signedIn && currentRouteName!='/Login'?
                <Catch>
                    <h2>{currentRouteName}</h2>
                        <HamburgerMenu
                            isOpen={open}
                            menuClicked={this.props.toggle.bind(this)}
                            width={28}
                            height={25}
                            strokeWidth={5}
                            rotate={0}
                            color='red'
                            borderRadius={0}
                            animationDuration={1.5}
                        />
                    <hr/>
                    <Navigation ref={(obj) => { this.nav = obj; }} open={open}/>
                </Catch>
                    :
                <span></span>}
            </div>)
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        signedIn: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        open: false,
        signedIn: false
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: select.authIdSelector(state) > 0,
        open: state.main.open
    })

    static reduxDispatchConfig = (dispatch,props) => ({
        toggle: (event) => {
            dispatch({
                type: `HAMBURGER`,
            })
        }
    })
}


