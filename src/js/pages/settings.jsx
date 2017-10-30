import React from 'react'
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'
const style = {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 0',
};

class Settings extends MyComponent {
    constructor(props) {
        super(props)
        this.props = props
    }

    MenuExampleSecondary = () => (
        <div>
            <Paper style={style}>
                <Menu desktop={true} width={256}>
                    <MenuItem primaryText="General" />
                    <MenuItem primaryText="Privacy" />
                    <MenuItem primaryText="Notifications" />
                    <MenuItem primaryText="Control Centre" />
                    <MenuItem primaryText="Sounds" />
                    <MenuItem primaryText="Battery" />
                    <Divider />
                    <MenuItem primaryText="Display" rightIcon={<ArrowDropRight />} />
                    <MenuItem primaryText="Brightness" rightIcon={<ArrowDropRight />} />
                    <MenuItem primaryText="Contrast" rightIcon={<ArrowDropRight />} />
                    <MenuItem primaryText="Alignment" rightIcon={<ArrowDropRight />} />
                    <MenuItem primaryText="List options" rightIcon={<ArrowDropRight />} />
                    <Divider />
                </Menu>
            </Paper>
        </div>
    );

    render() {
        return <div>
            <h2>Test2</h2>
            <div>
                {this.MenuExampleSecondary()}
            </div>
        </div>
    }
}

Settings.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const SettingsContainer = connect(
    (state) => {
        return {
            id: state.todaysRides.id
        }
    },
    (dispatch) => {
        return {
            onClick2: (id) => {
                dispatch(toggleTracking(id))
            }
        }
    }
)(Settings)


export default SettingsContainer

