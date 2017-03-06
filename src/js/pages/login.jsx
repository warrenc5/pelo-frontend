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

import style from '../layout/style'
import * as action from '../handler/actions'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    LoginForm = (props) => {
        const { handleSubmit, fbConnect, pristine, reset, submitting } = props
        return (
            <div id="login">
                <p id="error">
                    <b>Welcome to the Riders app.</b>
                </p>
                <button onClick={fbConnect()}>Login with facebook</button>
                <p class="dark">Or login locally</p>

                <form onSubmit={handleSubmit()}>
                    <table align="center">
                        <tr>
                            <div style={style.root}>
                                <Field name="name" component={materialTextField} label="Username or Email"/>
                            </div>

                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="password" component={materialTextField} label="Pasword"/>
                            </div>
                        </tr>
                    </table>
                    <div>
                        <button type="submit" component={materialButton}>Submit</button>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>{this.LoginForm(this.props)}</div>
        )
    }

    submitValidation(values) {
        alert('submit validation')
    }
}

const data = {name: "WozzaTest"}

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
            }),
            onSubmit: () => (...args) => dispatch({
                type: `LOGIN`,
                payload: args
            })
        }
    }
)(
    reduxForm({
        form: 'LoginForm',
        validate: function (values) {
            console.log('validate')
        },
        warn: function (values) {
            console.log('warn')
        }
    })(Login))


export default LoginContainer
