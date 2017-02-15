import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {

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
                        <td>
                            <input ng-model="username" type="text"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="dark">Password</span>
                        </td>
                        <td>
                            <input ng-model="password" type="password"/>
                        </td>
                    </tr>
                </table>

                <button ng-click="login(username,password);" type="submit" value="login">login</button>
            </form>
        </div>
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
