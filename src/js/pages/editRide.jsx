import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm, propTypes } from 'redux-form'
import Slider from 'material-ui/Slider';
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
    materialSelectField,
    materialDatePicker
} from './material.jsx'


@myAsyncFormConnect()
export default class RideEditor extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        /*
        this.setState({
            startDate: date
        });
        */
    }

    SliderExampleStep = () => (
        <Slider step={0.10} value={0.5}/>
    );

    EditRideForm = (props) => {
        const { handleSubmit, fbConnect, pristine, reset, submitting } = props
        return (
            <div>
                <p id="error">
                    <b>Edit Ride</b>
                </p>

                <form onSubmit={handleSubmit()}>
                    <table>
                        <tbody>
                        <tr>
                            <Field name="Title" component={materialTextField} label="Title"/>
                        </tr>
                        <tr>
                            {/**
                            <div style={style.root}>
                                <Field name="Date" label="Date"/>
                            </div>
                                **/}
                            <Field name="Ride Date" component={materialDatePicker} hintText="Ride Date" autoOk={true} />
                        </tr>
                        {/**
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
                                        onChange={this.onChange}
                                        onFileLoad={this.onFileLoad}/>
                            </div>
                        </tr>
                        **/}
                        </tbody>
                    </table>
                    <Field name="add"
                       label="Add"
                       type="submit"
                       component={materialButton}
                       onClick={this.props.handleSubmit(this.validate)} />
            </form>
        </div>
        )
    }

    render() {
        return (
            <div>{this.EditRideForm(this.props)}</div>
        )
    }

    submitValidation(values) {
        alert('submit validation')
    }

    onFileLoad = (e, file) => console.log(e.target.result, file.name);
    onChange = (route) => this.setState({route});

    static propTypes = {
        Title : PropTypes.string.isRequired,
        startDate : PropTypes.string.isRequired,
        ...propTypes
    }

    static reduxPropsConfig = (state, props) => ({
        initialValues: {
            Title: 'stuff',
            startDate: '2017-09-01'
        },
        Title: state.Title,
        startDate: state.startDate
    })

    static reduxDispatchConfig = (dispatch) => ({
        onSubmit: () => (...args) => dispatch({
            type: `EDITRIDE`,
            payload: args
        }),
        dateSelected: () => (event) => {
            dispatch({
                type: `SELECT`,
                payload: {}
            })
        }

    })

    static reduxAsyncConfig = [{
        key: `newRide`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            console.log("OK HERE")
            resolve(true)
            return {Title: "My new Ride", startDate: "yesterday"}
        }).then((result) =>result).catch((e)=> {
            console.log(e)
            throw e
        })
    }]

    static reduxFormConfig = {
        form: `EditRideForm`
    }
}

