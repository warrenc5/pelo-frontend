import React from 'react'
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {Form, SubmissionError} from 'redux-form'
import {Field, propTypes as reduxFormPropTypes} from 'redux-form'

import MyComponent, {Catch, myAsyncFormConnect} from '../widget/common'
import style from '../layout/style'
import {materialSwitch} from "../layout/material.jsx";

@myAsyncFormConnect()
export default class Settings extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
    }

    MenuExampleSecondary = () => (
        <div>
            <Paper style={style.block1}>
                <Form onSubmit={this.props.handleSubmit(this.validate)}>
                    <Menu>
                        <Divider/>
                        <MenuItem primaryText="Private Account">
                            <Field name="privateProfile"
                                   component={materialSwitch}
                                   label="Private Profile"
                            />
                        </MenuItem>

                        <MenuItem primaryText="Allow Sharing">

                            <Field name="allowSharing"
                                   component={materialSwitch}
                                   label="Allow Location Sharing"
                            />
                        </MenuItem>

                        <Divider/>
                        <MenuItem primaryText="Vibrate for Notifications">
                            <Field name="vibrate"
                                   component={materialSwitch}
                                   label="Vibrate For Notifications"
                            />
                        </MenuItem>
                        <MenuItem primaryText="Save Messages">

                            <Field name="saveMessages"
                                   component={materialSwitch}
                                   label="Save Messages"
                            />
                        </MenuItem>
                        <MenuItem primaryText="List options">
                            <Field name="listOptions"
                                   component={materialSwitch}
                                   label="List Options"
                            />
                        </MenuItem>
                    </Menu>
                </Form>
            </Paper>

        </div>
    );

    render() {
        return <div>
            {this.MenuExampleSecondary()}
        </div>
    }


    validate = (values, dispatch, props) => {
        return true
    }

    static propTypes = {
        privateProfile: PropTypes.bool.isRequired,
        vibrate: PropTypes.bool.isRequired,
        allowSharing: PropTypes.bool.isRequired,
        saveMessages: PropTypes.bool.isRequired,
        listOptions: PropTypes.bool.isRequired,
        ...reduxFormPropTypes,
    }

    static reduxPropsConfig = (state, props) => ({
        privateProfile: state.settings.privateProfile,
        vibrate: state.settings.vibrate,
        allowSharing: state.settings.allowSharing,
        saveMessages: state.settings.saveMessages,
        listOptions: state.settings.listOptions,
    })

    static reduxFormConfig = {
        form: `SettingsForm`,
    }
}

