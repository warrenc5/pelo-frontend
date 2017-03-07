import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import React, { PropTypes } from 'react'

//http://redux-form.com/6.1.0/examples/material-ui/

export const materialButton = ({ label , onClick }, ...custom) => (
    <FlatButton label={label} onClick={onClick} />
)

export const materialTextField = ({ input, label, type, meta: { asyncValidating, touched, error } }, ...custom) => (
    <div className={asyncValidating ? 'async-validating' : ''}>
        <TextField hintText={label}
                   floatingLabelText={label}
                   errorText={touched && error}
                   type={type}
            {...input}
            {...custom}
        />
    </div>
)

export const materialCheckbox = ({ input, label }) => (
    <Checkbox label={label}
              checked={input.value ? true : false}
              onCheck={input.onChange}/>
)

export const materialRadioGroup = ({ input, ...rest }) => (
    <RadioButtonGroup {...input} {...rest}
        valueSelected={input.value}
        onChange={(event, value) => input.onChange(value)}/>
)

export const materialSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}
        {...custom}/>
)
