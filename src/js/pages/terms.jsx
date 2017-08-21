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

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

export default class Terms extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return (
            <div>
                <h1>1. Terms </h1>
                <p>By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of
                    Use,
                    all applicable laws and regulations, and agree that you are responsible for compliance with any
                    applicable local laws.
                    If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    The materials contained in this web site are protected by applicable copyright and trade mark
                    law.</p>

                <h1>2. Use License </h1>
                <p>a. Permission is granted to temporarily download one copy of the materials (information or software)
                    on Pelo's web site for personal, non-commercial transitory viewing only. This is the grant of a
                    license,
                    not a transfer of title, and under this license you may not:</p>

                <p> i. modify or copy the materials;
                    ii. use the materials for any commercial purpose, or for any public display (commercial or
                    non-commercial);
                    iii.attempt to decompile or reverse engineer any software contained on Pelo's web site;
                    iv. remove any copyright or other proprietary notations from the materials; or
                    v. transfer the materials to another person or "mirror" the materials on any other server.
                </p>

                <p>This license shall automatically terminate if you violate any of these restrictions and may be
                    terminated by Pelo at
                    any time. Upon terminating your viewing of these materials or upon the termination of this license,
                    you must destroy
                    any downloaded materials in your possession whether in electronic or printed format.</p>
            </div>
        )
    }
}
