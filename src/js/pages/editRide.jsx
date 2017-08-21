import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm, propTypes } from 'redux-form'
import Slider from 'material-ui/Slider';
import TimePicker from 'material-ui/TimePicker';
import {
    Checkbox,
    RadioButtonGroup,
    SelectField,
    TextField,
    Toggle,
    DatePicker,
} from 'redux-form-material-ui'
import Upload from 'material-ui-upload';

import style from '../layout/style'
import * as action from '../handler/actions'
import {ngScope,myAsyncFormConnect} from '../service/bridge'

import MyComponent from '../widget/common'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

@myAsyncFormConnect()
export default class RideEditor extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
    }

    DatePickerExampleSimple = () => (
        <div>
            <DatePicker mode="landscape"/>
        </div>
    );

    SliderExampleStep = () => (
        <Slider step={0.10} value={0.5}/>
    );

    TimePickerExampleSimple = () => (
        <div>
            <TimePicker
            />
        </div>
    );

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
                                <Field name="Title" component={materialTextField} label="Title"/>
                            </div>

                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="Date" label="Date"/>
                            </div>
                            <div>
                                {this.DatePickerExampleSimple(this.props)}
                            </div>
                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="Time" label="Time"/>
                            </div>
                            <div>
                                {this.TimePickerExampleSimple(this.props)}
                            </div>
                        </tr>
                        <tr>
                            <div style={style.root}>
                                <Field name="Ride Difficulty" label="Ride Difficulty"/>
                            </div>
                            <div>
                                {this.SliderExampleStep(this.props)}
                            </div>
                        </tr>
                        <tr>
                            <div>
                                <a href="http://placehold.it"><img src="http://placehold.it/200x200"></img></a>
                            </div>
                        </tr>
                        <tr>
                            <div>
                                <Upload title="Route"
                                        label="Add"
                                        initialItems={this.state.route}
                                        onChange={this.onChange}
                                        onFileLoad={this.onFileLoad}/>
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

    onFileLoad = (e, file) => console.log(e.target.result, file.name);
    onChange = (route) => this.setState({route});

    static propTypes = {
        ...propTypes
    }

    static reduxPropsConfig = (state, props) => ({
        initialValues: state.login
    })

    static reduxDispatchConfig = (dispatch) => ({
        onSubmit: () => (...args) => dispatch({
            type: `EDITRIDE`,
            payload: args
        })
    })
    static reduxAsyncConfig = [{
        form: 'EditRideForm',
        validate: function (values) {
            console.log('validate')
        },
        warn: function (values) {
            console.log('warn')
        }
    }]
}

