import React from 'react'
import PropTypes from 'prop-types';

import moment from 'moment'
import TextField from 'material-ui/TextField'
import submit from "redux-form"
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
//http://redux-form.com/6.1.0/examples/material-ui/
import Switch from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import Upload from 'material-ui-upload/Upload';
import UploadPreview from 'material-ui-upload/UploadPreview';
import {ReactMaterialImage} from 'react-material-image'

/**
 * TODO
 * https://material-ui-next.com/
 */

export const materialButton = ({label, onClick}, ...custom) => (
    <FlatButton label={label} onClick={onClick}/>
)

export const materialTextField = ({dispatch, input, label, type, onKeyDown, meta: {asyncValidating, touched, error}}, ...custom) => (
    <div className={asyncValidating ? 'async-validating' : ''}>
        <TextField hintText={label}
                   floatingLabelText={label}
                   errorText={touched && error}
                   type={type}
                   onKeyDown={onKeyDown}
                   {...input}
                   {...custom}
        />
    </div>
)

export const materialCheckbox = ({input, label}) => (
    <Checkbox label={label}
              checked={input.value ? true : false}
              onCheck={input.onChange}/>
)

export const materialRadioGroup = ({input, ...rest}) => (
    <RadioButtonGroup {...input} {...rest}
                      valueSelected={input.value}
                      onChange={(event, value) => input.onChange(value)}/>
)

export const materialSelectField = ({input, label, meta: {touched, error}, children, ...custom}) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(event, value)}
        children={children}
        {...custom}/>
)
export const materialDatePicker = ({input, defaultValue, meta: {touched, error}}, ...custom) => (
    <DatePicker
        errorText={touched && error}
        {...input}
        value={input.value !== '' ? new Date(input.value) : null}
        format="YYYY-MM-DD"
        onChange={(event, value) => {
            console.log(value);
            input.onChange(moment(value).format('YYYY-MM-DD'))
        }}
        {...custom}
    />
)
//TODO: add combo datetime https://www.npmjs.com/package/material-ui-datetimepicker

export const materialTimePicker = ({input, defaultValue, meta: {touched, error}}, ...custom) => (
    <TimePicker
        errorText={touched && error}
        {...input}
        format="24hr"
        value={input.value !== '' ? input.value : null}
        onChange={(event, value) => {
            console.log(value);
            input.onChange(moment(value).format('HH:mm'))
        }}
        {...custom}
    />
)

export const materialSlider = ({input, defaultValue}) => (
    <Slider step={0.10}
            value={input.value !== '' ? input.value : 0}
            {...input}
            onChange={(event, value) => {
                console.log(value)
                input.onChange(value)
            }}/>
)

export const materialUpload = (input, meta) => (
    <Upload {...input}
            onChange={input.onChange}
            onFileLoad={input.onFileLoad}/>
)

export const materialUploadPreview = (input, meta) => (
    <UploadPreview {...input}
                   onChange={input.onChange}
                   onFileLoad={input.onFileLoad}/>
)
export const materialImage = ({dispatch, input, label, type, onKeyDown, meta: {asyncValidating, touched, error}}, ...custom) => (
    <div className={asyncValidating ? 'async-validating' : ''}>
        <div>
            <ReactMaterialImage {...custom} />
        </div>
    </div>
)

export const materialSwitch = ({dispatch, input, label, type, onKeyDown, meta: {asyncValidating, touched, error}}, ...custom) => (
    <Switch label={label} {...custom} />
)

