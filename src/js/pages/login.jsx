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

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    submitter(values) {
        if (!['john', 'paul', 'george', 'ringo'].includes(values.username)) {
            throw new SubmissionError({username: 'User does not exist', _error: 'Login failed!'})
        } else if (values.password !== 'redux-form') {
            throw new SubmissionError({password: 'Wrong password', _error: 'Login failed!'})
        } else {
            window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
        }
    }

    LoginForm = (props) => {
        const { handleSubmit, fbConnect, pristine, reset, submitting , touched,submitter    } = props
        return (
            <div id="login">
                <p id="error">
                    <b>Welcome to the Riders app.</b>
                </p>
                <Field component={materialButton} onClick={fbConnect()} label="Login with facebook" />
                <p class="dark">Or login locally</p>

                {touched && error && <span>{error}</span>}
                <form onSubmit={handleSubmit(submitter)}>
                    <table align="center">
                        <tr>
                            <div style={style.root}>
                                <Field name="username" component={materialTextField} label="Username or Email"/>
                            </div>

                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="password" component={materialTextField} label="Pasword"/>
                            </div>
                        </tr>
                    </table>
                    <div>
                        <Field label="LOGIN" type="submit" component={materialButton} disabled={submitting}/>
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
