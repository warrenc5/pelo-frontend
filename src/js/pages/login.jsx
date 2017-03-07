import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, propTypes } from 'redux-form'
import {
    Checkbox,
    RadioButtonGroup,
    SelectField,
    TextField,
    Toggle,
    DatePicker,
} from 'redux-form-material-ui'
import { SubmissionError } from 'redux-form'

import style from '../layout/style'
import * as action from '../handler/actions'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

const validate = (values, dispatch) => {
    if (!['wozza'].includes(values.username)) {
        throw new SubmissionError({username: 'User does not exist', _error: 'Login failed!'})
    } else {
        dispatch({
            type: `LOGIN`,
            payload: values
        })
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    LoginForm = (props) => {
        const { handleSubmit, fbConnect, pristine, error, reset, submitting, touched , asyncValidating} = props
        return (
            <div id="login">
                <p id="error">
                    <b>Welcome to the Riders App9.</b>
                </p>

                <Field name="loginFB" component={materialButton} onClick={fbConnect()} label="Login with facebook"/>
                <p>Or login locally</p>

                {touched && error && <span>Any Error: {error}</span>}
                <form>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div style={style.root}>
                                    <Field name="username" component={materialTextField} label="Username or Email"
                                           asyncValidating={asyncValidating}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={style.root}>
                                    <Field name="password" component={materialTextField} label="Pasword"/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <Field name="login" label="LOGIN" type="button"
                                           onClick={this.props.handleSubmit(validate)}
                                           component={materialButton} disabled={pristine || submitting}/>
                                </div>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>{this.LoginForm(this.props)}</div>
        )
    }

    // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

}

Login.propTypes = {
    ...propTypes
}

var LoginContainer = connect(
    (state) => {
        return {
            initialValues: state.login,
        }
    },
    (dispatch) => {
        return {
            fbConnect: () => (...args) => dispatch({
                type: `FBLOGIN`,
                payload: args
            })
        }
    }
)(
    reduxForm({
        form: 'LoginForm',
        asyncValidate: (values/*, dispatch */) => new Promise((resolve,reject)=> {
            console.log('promise')
            //doSomething
            resolve(true)
        }).then(()=> {
            console.log("v: " + values.username)
            if (!values.username.startsWith('wozza')) {
                throw {username: 'That username is taken'}
            }
        }),
        asyncBlurFields: ['username']
    })(Login))


export default LoginContainer
