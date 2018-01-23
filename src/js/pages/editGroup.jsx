/**
 * Created by William Supardi on 1/8/2018.
 */
import React from 'react'
import PropTypes from 'prop-types';
import {Form, SubmissionError, Field, reduxForm, propTypes} from 'redux-form'
import SubmitButton from 'redux-form-react-submitbutton'
import {ngScope} from '../service/bridge'

import style from '../layout/style'
import * as action from '../handler/actions'

import MyComponent, {Catch, myAsyncFormConnect} from '../widget/common'

import {
    materialButton,
    materialTextField,
    materialCheckbox,
    materialRadioGroup,
    materialSelectField,
    materialDatePicker,
    materialTimePicker,
    materialUpload,
    materialUploadPreview,
    materialSlider
} from '../layout/material.jsx'

import {GridList, GridTile} from 'material-ui/GridList';

import {ReactMaterialImage} from 'react-material-image'

@myAsyncFormConnect()
export default class GroupEditor extends MyComponent {

    constructor(props) {
        super(props)
        this.props = props
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        })
    }

    EditRideForm = (props) => {
        const {handleSubmit, pristine, reset, submitting} = props
        return (
            <Form onSubmit={handleSubmit(this.validate)} type="multipart/form-data">
                <table>
                    <tbody>
                    <tr>
                        <Field label="Group Established " name="GroupEstablished" openToYearSelection={true}
                               hintText="Group Establihed"/>
                    </tr>
                    <tr>
                        <Field name="Group Name" component={materialTextField} label="Group Name"/>
                    </tr>
                    <tr>
                        <Field name="Meeting Point" component={materialTextField} label="Meeting Point"/>
                    </tr>
                    <tr>
                        <GridList
                            cols={3}
                            style={style.gridList}>
                            {selectedRide.participants.map(p =>
                                <GridTile data-scroll-reveal
                                          title={p.slug}>
                                    <ReactMaterialImage width="100%" height="100%" class="round-image"
                                                        src={ngScope().state.baseUrl + `userimage/${p.id}`}/>
                                </GridTile>
                            )}
                        </GridList>
                    </tr>
                    </tbody>
                </table>
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

    //onFileLoad = (e, file) => console.log(e.target.result, file.name);
    onFileLoad = (e, file) => this.props.loadRoute(e.target.result)
    onChange = (v) => this.props.loadRoute2(v)

    validate = (values, dispatch, props) => {
        //TODO do this first and if it fails then fail.
        //return Login.reduxFormConfig.asyncValidate(values, dispatch).catch((e)=>())
        return new Promise((resolve, reject) => {
            ngScope().client.newRide({...values, Route: props.Route}, (name, data) => {
                resolve(data)
            }, (e) => {
                reject(e)
            })
        }).then((result) => {
            dispatch({
                type: `RIDEADD`,
                payload: result
            })
            //dispatch(push(props.returnPath))
        }).catch((e) => {
            //console.log('>>'+e  + " " + e.stack) //JSON.stringify(e))
            dispatch({
                type: `RIDEADD_ERROR`,
                payload: {error: 'there was some error ' + e}
            })
            throw new SubmissionError({_error: 'whoops' + JSON.stringify(e)})
        })
    }

    static propTypes = {
        Title: PropTypes.string.isRequired,
        RideDate: PropTypes.object.isRequired,
        RideTime: PropTypes.object.isRequired,
        Route: PropTypes.object.isRequired,
        Difficulty: PropTypes.number.isRequired,
        ...propTypes
    }

    static reduxPropsConfig = (state, props) => ({
        initialValues: {
            Title: 'stuff',
            RideDate: '2017-09-01',
            RideTime: '07:30',
            Difficulty: 0.2,
            Route: null
        },
        Title: state.newRide.Title,
        RideDate: state.newRide.RideDate,
        RideTime: state.newRide.RideTime,
        Difficulty: state.newRide.Difficulty,
        Route: state.newRide.Route,
    })

    static reduxDispatchConfig = (dispatch) => ({
        onSubmit: () => (...args) => dispatch({
            type: `EDITRIDE`,
            payload: args
        }),
        dateSelected: (event) => {
            dispatch({
                type: `SELECT`,
                payload: {}
            })
        },
        loadRoute: (route) => dispatch({
            type: `ROUTELOAD`,
            payload: route
        }),
        loadRoute2: (v) => dispatch({
            type: `ROUTECHANGE`,
            payload: v
        })
    })

    static reduxAsyncConfig = [{
        key: `newRide`,
        promise: ({store, params, helpers, matchContext, router, history, location, routes}) => new Promise((resolve, reject) => {
            console.log("OK HERE")
            resolve(true)
            return {Title: "My new Ride", startDate: "yesterday"}
        }).then((result) => result).catch((e) => {
            console.log(e)
            throw e
        })
    }]

    static reduxFormConfig = {
        form: `EditRideForm`
    }
}

