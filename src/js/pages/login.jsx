import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField';

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import style from '../layout/style'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    Password = () => (
        <div style={style.root}>
            <TextField
                hintText="Password Field"
                floatingLabelText="Password"
                type="Password"
            /><br />
        </div>
    )

    Username = () => (
        <div style={style.root}>
            <TextField
                hintText="Username Field"
                floatingLabelText="Username"
                type="password"
            /><br />
        </div>
    )

    SubmitButton = () => (
        <div>
            <FlatButton label="Submit"/>
        </div>
    );

    render() {
        return (
        <div class="login" id="login" ng-show="viz.auth">
            <p id="error">
                <b>Welcome to the Riders app.</b>
            </p>
            <button ng-click="loginFB(username);">login with facebook</button>
            <p class="dark">Or login locally</p>

            <form name="alice" target="_self" ng-submit="login();">
                <table align="center">
                    <tr>
                        <td>
                            <span class="dark">Username or Email</span>
                        </td>
                        <div>
                            {this.Username()}
                        </div>
                        <td>
                            <input ng-model="username" type="text"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="dark">Password</span>
                        </td>
                        <div>
                            {this.Password()}
                        </div>
                        <td>
                            <input ng-model="password" type="password"/>
                        </td>
                    </tr>
                </table>
                <div>
                    {this.SubmitButton()}
                </div>
                <button ng-click="login(username,password);" type="submit" value="login">login</button>
            </form>
        </div>
        )
    }
}

Login.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const LoginContainer = connect(
    (state) => {
        return {
            login: state.login
        }
    },
    (dispatch) => {
        return {
            onClick2: (id) => {
                dispatch(toggleTracking(id))
            }
        }
    }
)(Login)
export default LoginContainer
