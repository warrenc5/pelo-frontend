import React, { PropTypes } from 'react'
//import TextField from 'material-ui/TextField';

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import { Field, reduxForm } from 'redux-form'
import {
    Checkbox,
    RadioButtonGroup,
    SelectField,
    TextField,
    Toggle,
    DatePicker
} from 'redux-form-material-ui'
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

    SubmitButton = ({ input, label, meta: { touched, error }, children, ...custom}) => (
        <div>
            <FlatButton label="Submit"/>
        </div>
    )

    LoginForm = (props) => {
        const { handleSubmit, pristine, reset, submitting } = props
        alert(props)
        return (
            <div class="login" id="login" ng-show="viz.auth">
                <p id="error">
                    <b>Welcome to the Riders app.</b>
                </p>
                <button ng-click="loginFB(username);">Login with facebook</button>
                <p class="dark">Or login locally</p>

                <form onSubmit={handleSubmit()}>
                    <table align="center">
                        <tr>
                            <Field name="firstName" component={UserName} label="Username or Email"/>
                        </tr>
                        <tr>
                            <td>
                                <span class="dark">Password</span>
                            </td>
                            <div>
                                {this.Password()}
                            </div>
                        </tr>
                    </table>
                    <div>
                        {this.SubmitButton()}
                    </div>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>{this.LoginForm()}</div>
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
)
(reduxForm({form: 'LoginForm'})(Login))


export default LoginContainer
