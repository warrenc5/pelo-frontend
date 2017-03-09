import React, { PropTypes } from 'react'
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
import { SubmissionError } from 'redux-form'

import style from '../layout/style'
import * as action from '../handler/actions'
import keydown from 'react-keydown'

import {
    materialButton,
    materialTextField,
    materialCheckbox ,
    materialRadioGroup ,
    materialSelectField
} from './material.jsx'

import submit from "redux-form-submit"
import {debug0,debug2, debugJSON} from '../service/misc'
import ngScope from '../service/bridge'
import { browserHistory } from 'react-router'

const onSubmit = (values) => {
    alert('values' + values)
}
class Login extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
        this.config = Login.config
    }

    LoginForm = (props) => {
        const { handleSubmit, fbConnect, pristine, error, reset, submitting, touched , asyncValidating} = props
        return (
            <div id="login">
                <p id="error">
                    <b>Welcome to the Riders App9.</b>
                </p>

                <Field name="loginFB" component={materialButton} onClick={fbConnect()} label="Login with facebook"/>
                <p>Or login locally</p>

                {submitting && <span>Logging you in now.</span>}
                {error && <span>Any Error: {error}</span>}

                <form onSubmit={handleSubmit(validate)}>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div style={style.root}>
                                    <Field name="username"
                                           component={materialTextField}
                                           label="Username or Email"
                                           asyncValidating={asyncValidating}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={style.root}>
                                    <Field name="password"
                                           type="password"
                                           component={materialTextField}
                                           label="Pasword"
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <Field name="login"
                                           label="LOGIN"
                                           type="submit"
                                           onClick={this.props.handleSubmit(validate)}
                                           component={materialButton}
                                           disabled={pristine || submitting}
                                    />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }

    componentDidMount() {
        const { submitting } = this.props
        //this.props.params.userId -- this is from the router?

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitting) {
            const { submitting } = nextProps
        }
        //FIXME - how to call with
        const { ok } = nextProps
        alert(ok)
        if(ok) {
            alert('OK')
            const { router } = nextProps
            router.push('/groups')
        }
        this.props.test()
    }

    render() {
        return (
            <div>{this.LoginForm(this.props)}</div>
        )
    }

    static propTypes = {
        ok: PropTypes.bool.isRequired,
        test: PropTypes.func.isRequired,
        ...propTypes
    }

    @keydown('enter')
    doSubmit(event) {
        const { dispatch} = this.props
        dispatch(submit(Login.config))
    }

    static contextTypes:{
        router: React.PropTypes.object
        }

    static config = {
        form: 'LoginForm',
        onSubmit,
        asyncValidate: (values, dispatch) => new Promise((resolve, reject)=> {
            console.log('promise')
            resolve(true)
        }).then((b)=> {
            //FIXME move up to the promise - use resolve and catch and reject
            if (!values.username.startsWith('wozza')) {
                throw {username: 'That username is taken'}
            }
        }).catch((e)=> {
        }),
        asyncBlurFields: ['username']
    }
}

const validate = (values, dispatch) => {
    if (!['wozza'].includes(values.username)) {
        throw new SubmissionError({username: 'User does not exist', _error: 'Login failed!'})
    } else {
        var p = new Promise((resolve, reject)=> {
            ngScope().client.login(values.username, values.password, (name, data)=> {
                resolve(data)
            }, (e)=> {
                reject(e)
            })
        }).then((result)=> {
            dispatch({
                type: `LOGIN`,
                payload: result
            })

        }).catch((e)=> {
            dispatch({
                type: `LOGIN_ERROR`,
                payload: {error: 'there was some error ' + e.message}
            })
        })
    }
}


var LoginContainer = connect(
    (state,props) => {
        return {
            ok: false,
            test: () => () => {
                alert('hello' + props.ok)
            },
            initialValues: {username: 'wozza', password: 'password'} //202
            //initialValues: {username: 'wozza', password: 'password1'} //401
        }
    },
    (dispatch) => {
        return {
            fbConnect: () => (event) => new Promise((resolve, reject)=> {

                //FIXME --event or event1?
                event.preventDefault

                //TODO how to preset users email?
                var email = 'wozza@nowhere.com'
                ngScope().fb.loginFB(email, (response)=> {

                    resolve(response)
                }, (e)=> {
                    reject(e)
                })
            }).then((response)=> {
                dispatch({
                    type: `FBLOGIN`,
                    payload: response
                })
            }).catch((e)=> {
                dispatch({
                    type: `FBLOGIN_ERROR`,
                    payload: {error: e}
                })
            })
        }
    })(reduxForm(Login.config)(Login))

export default LoginContainer