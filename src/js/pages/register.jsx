import React from 'react'
import PropTypes from 'prop-types';

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
import MyComponent,{myAsyncFormConnect} from '../widget/common'

import {ngScope} from '../service/bridge'
import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

@myAsyncFormConnect()
export default class Register extends MyComponent {

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
                        <tr>
                            <div>
                                <a href="http://placehold.it"><img src="http://placehold.it/200x200"></img></a>
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

    static propTypes = {
        ...propTypes
    }

    static reduxPropsConfig = (state, props) => ({
        initialValues: state.login
    })

    static reduxDispatchConfig = (dispatch) => ({
        onSubmit: () => (...args) => dispatch({
            type: `REGISTER`,
            payload: args
        })
    })
    static reduxAsyncConfig = [{
        form: 'RegisterForm',
        validate: function (values) {
            console.log('validate')
        },
        warn: function (values) {
            console.log('warn')
        }
    }]
}
