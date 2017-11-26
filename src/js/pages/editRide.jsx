import React from 'react'
import PropTypes from 'prop-types';
import {Form,SubmissionError, Field, reduxForm, propTypes } from 'redux-form'

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

import MyComponent,{Catch,myAsyncFormConnect} from '../widget/common'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField,
    materialDatePicker,
    materialTimePicker,
    materialUpload,
    materialSlider
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


    EditRideForm = (props) => {
        const { handleSubmit, pristine, reset, submitting } = props
        return (
            <Form onSubmit={handleSubmit(this.validate)}>
                <table>
                    <tbody>
                    <tr>
                        <Field name="Title" component={materialTextField} label="Title"/>
                    </tr>
                    <tr>
                        <Field label="Ride Date" name="RideDate" component={materialDatePicker} hintText="Ride Date" autoOk={true}/>
                    </tr>
                    <tr>
                        <Field label="Ride Time" name="RideTime" component={materialTimePicker} hintText="Ride Time" autoOk={true}/>
                    </tr>
                    <tr>
                        <Field label="Difficulty" name="Difficulty" component={materialSlider} label="Difficulty"/>
                    </tr>
                    <tr>
                        <a href="http://placehold.it"><img src="http://placehold.it/200x200"></img></a>
                    </tr>
                    <tr>
                            <Catch>
                            <Field name="Route" component={materialUpload} label="Upload Route"
                                   onChange={this.onChange}
                                   onFileLoad={this.onFileLoad}/>
                            </Catch>
                    </tr>
                    </tbody>
                </table>

                <Field name="add"
                       label="Add"
                       type="submit"
                       component={materialButton}
                       onClick={this.props.handleSubmit(this.validate)}/>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.EditRideForm(this.props)}
            </div>
        )
    }

    submitValidation(values) {
        alert('submit validation')
    }

    onFileLoad = (e, file) => console.log(e.target.result, file.name);
    onChange = (route) => this.setState({route});

    validate = (values, dispatch) => {
        return Promise.resolve(true)
    }

    static propTypes = {
        Title: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
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

