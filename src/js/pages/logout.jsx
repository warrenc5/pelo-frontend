import React from 'react'
import PropTypes from 'prop-types';
import MyComponent, {Catch, myAsyncFormConnect} from '../widget/common'
import {Field, propTypes} from 'redux-form'
import {NavLink, Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'

import * as select from '../handler/selectors'
import {routes} from '../Router.jsx'

@myAsyncFormConnect()
export default class Logout extends MyComponent {

    static NAME = "Logout"

    constructor(props) {
        super(props)
        this.props = props
    }

    ErrorRender() {
        return (
            <div>
                <p>Error</p>
                <span color="red">{JSON.stringify(this.props.error.error.toString())}</span>
                {this.props.error.info.componentStack.split('\n').map((c) => (<small>
                    <small><span> {c} <br/></span></small>
                </small>))}
            </div>
        )
    }

    render() {
        console.log(this.props.error === null)
        return super.isError() ? (<h1>No way, fail failed :(</h1>) : (
            <div>
                {this.props.signedIn ? <div><p>Sorry {this.props.login.name}</p>
                    <FlatButton label="Logout" onClick={this.props.logout()}/></div> : <p>You were logged out</p>
                }

                <NavLink activeClassName="active"
                         to={this.props.defaultPath}><span>Return to {this.props.defaultPath}</span></NavLink>

                {this.props.error == null || this.ErrorRender()}
            </div>
        )
        {/**
         dispatch(push(Router.RIDES))
         import { push } from 'react-router-redux'
         **/
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        /**const {dispatch} = this.props
         dispatch({
            type: `LOGOUT`,
            payload: this.props.login
        })
         **/

    }

    componentDidMount() {

        console.log("Logout")
    }

    static propTypes = {
        signedIn: PropTypes.bool.isRequired,
        login: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        defaultPath: PropTypes.string.isRequired,
        error: PropTypes.object.isRequired,
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: state.login != null && state.login.id > 0,
        login: state.login,
        initialValues: {
            login: {name: "user"}, logout: false
        },
        defaultPath: select.defaultPath(state),
        error: state.error ? null : state.error, //TODO move to selector
    })

    static reduxDispatchConfig = (dispatch) => ({
        logout: () => (event) => {
            dispatch({
                type: `LOGOUT_CONFIRM`,
                payload: ''
            })
        }
    })
}