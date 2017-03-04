import React, { PropTypes } from 'react'
//import TextField from 'material-ui/TextField';

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
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
import doLogin from '../handler/actions'

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
                type="text"
            /><br />
        </div>
    )

    SubmitButton = () => (
        //({ input, label, meta: { touched, error }, children, ...custom}) => (
        <div>
            <FlatButton label="Submit"/>
        </div>
    )


    LoginForm = (props) => {
        const { handleSubmit, load, pristine, reset, submitting } = props
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
                            <Field name="name" component={this.Username} label="Username or Email"/>
                        </tr>
                        <tr>
                            <td>
                                <span class="dark">Password</span>
                            </td>
                            <div>
                                <Field name="name" component={this.Password} label="Pasword"/>
                            </div>
                        </tr>
                    </table>
                    <div>
                        {this.SubmitButton()}
                        <button type="submit">Submit</button>

                        <button onClick={load(data)}>Load</button>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>{this.LoginForm(this.props)}</div>
        )
    }

    submitValidation(values) {
        alert('submit validation')
    }
}

const data = {name: "WozzaTest"}

Login.propTypes = {
    ...propTypes,
    onSubmit: PropTypes.func.isRequired

}
var t = {
    type: 'LOGIN',
    payload: {data: data}
}

function fun1(data) {
    return t
}

var LoginContainer = connect(
    (state) => {
        return {
            initialValues: state.login,
            login: state.login
        }
    },
    (dispatch) => {
        return {
            load: () => (data) => dispatch(fun1(data)),
            onSubmit: () => (data) => dispatch(fun1(data))
        }
    }
)(
    reduxForm({
        form: 'LoginForm',
        validate: function (values) {
            console.log('validate')
        },
        warn: function (values) {
            console.log('warn')
        }
    })(Login))


export default LoginContainer
