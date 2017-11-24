import React from 'react'
import PropTypes from 'prop-types';
import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'
import { Field, propTypes } from 'redux-form'
import { NavLink, Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'

import {routes} from '../Router.jsx'

@myAsyncFormConnect()
export default class Logout extends MyComponent {

    static NAME = "Logout"

    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return super.isError() ? (<h1>No way</h1>) : (
            <div>
                <span>OK Logout thanks {this.props.login.name} {this.props.signedIn?"NO":"YES"}'</span>

                {this.props.signedIn?
                <FlatButton label="Logout" onClick={this.props.logout()}/>


                    :<NavLink activeClassName="active" to={routes.RIDES}>Jump back in.</NavLink>}
            </div>
        )
        {/**
           dispatch(push(Router.RIDES))
import { push } from 'react-router-redux'
**/}
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
        logout: PropTypes.func.isRequired
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: state.login != null && state.login.id > 0,
        login: state.login,
        initialValues: {
            login: {name:"user"},logout:false
        }
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