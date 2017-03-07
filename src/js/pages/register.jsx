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

class Register extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    RegisterForm = (props) => {
        const { handleSubmit, fbConnect, pristine, reset, submitting } = props
        return (
            <div class="login" id="login">
                <p id="error">
                    <b>Welcome to the Riders application.</b>
                </p>
                <button onClick={fbConnect()}>Login with facebook</button>
                <p class="dark">Or login locally</p>

                <form onSubmit={handleSubmit()}>
                    <table align="center">
                        <tr>
                            <div style={style.root}>
                                <Field name="First Name" component={materialTextField} label="First Name"/>
                            </div>

                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="Last Name" component={materialTextField} label="Last Name"/>
                            </div>
                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="Email" component={materialTextField} label="Email"/>
                            </div>
                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="Password" type="password" component={materialTextField} label="Password"/>
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

Register.propTypes = {
    ...propTypes
}

var RegisterContainer = connect(
    (state) => {
        return {
            initialValues: state.login,
        }
    },
    (dispatch) => {
        return {
            onSubmit: () => (...args) => dispatch({
                type: `REGISTER`,
                payload: args
            })
        }
    }
)(
    reduxForm({
        form: 'RegisterForm',
        validate: function (values) {
            console.log('validate')
        },
        warn: function (values) {
            console.log('warn')
        }
    })(Register))


export default RegisterContainer
