import React, {Component, PropTypes } from 'react'
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
import { asyncConnect as reduxAsyncConnect } from 'redux-connect'


function myConnect(reduxPropsConfig, reduxDispatchConfig, reduxFormConfig) {
    return target => reduxAsyncConnect(
        [{
            key: 'lunch',
            promise: ({ params, helpers }) => Promise.resolve({id: 1, name: 'Borsch'})
        }], reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target))
}

class Login extends Component {

    constructor(props) {
        super(props)
        this.props = props
        //this.reduxFormConfig = Login.reduxFormConfig
    }

    LoginForm = (props) => {
        const {handleSubmit,
            fbConnect,
            pristine,
            error,
            reset,
            submitting,
            touched,
            asyncValidating,
            ok,
            } = props
        return (
            <div id="login">
                <p id="error">
                    <b>Welcome to the Riders App9.</b>
                </p>

                <Field name="loginFB" component={materialButton} onClick={fbConnect()} label="Login with facebook"/>
                <span>OK?{ok?'Nigz':'Nups'}</span>
                <p>Or login locally</p>

                {submitting && <span>Logging you in now.</span>}
                {error && <span>Any Error: {error}</span>}

                <form onSubmit={handleSubmit(Login.validate)}>
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
                                           onClick={this.props.handleSubmit(Login.validate)}
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
        debug2('component did mount')

        const { submitting } = this.props
        //this.props.params.userId -- this is from the router?
        const { hasSubmitFailed } = this.props

        if (hasSubmitFailed) {
            alert('OK')
            const { router } = this.props
            router.push('/groups')
        }


    }

    componentWillReceiveProps(nextProps) {
        debug2('component will receive props')

        const { ok,submitting } = nextProps

        if (ok) {
            alert('OK')
            const { router } = nextProps
            router.push('/groups')
        }
        //this.props.test()
    }

    render() {
        return (
            <div>{this.LoginForm(this.props)}</div>
        )
    }


    @keydown('enter')
    doSubmit(event) {
        const {dispatch} = this.props
        dispatch(submit(Login.reduxFormConfig))
    }

    static contextTypes:{
        router: React.PropTypes.object
        }

    static validate = (values, dispatch) => {
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

    static propTypes = {
        ok: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func.isRequired,
        fbConnect: PropTypes.func.isRequired,
        //test: PropTypes.func.isRequired,
        ...propTypes
    }

    static reduxPropsConfig = (state, props) => ({
        ok: props.ok,
        test: () => () => {
            this.props.ok = true
            alert('hello' + props.ok)
        },
        initialValues: {
            username: 'wozza', password: 'password'
        } //202
        //initialValues: {username: 'wozza', password: 'password1'} //401
    })

    static reduxDispatchConfig = (dispatch) => ({
        onSubmit: () => debug2('values2' + JSON.stringify(values)),
        fbConnect: ()=> (event) =>
            new Promise((resolve, reject)=> {
                //FIXME --event or event1?
                //event.preventDefault

                //TODO how to preset users email?
                var email = 'wozza@nowhere.com'

                ngScope().fb.loginFB(email, (response)=> {
                        resolve(dispatch, response)
                    }
                    , (e)=> {
                        reject(e)
                    })
            }).
            then((response)=> {
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
    })

    static reduxFormConfig = {
        form: 'LoginForm',
        onSubmit: (values) => debug2('values' + JSON.stringify(values)),
        asyncValidate: (values, dispatch) => new Promise((resolve, reject)=> {
            //FIXME move up to the promise - use resolve and catch and reject
            if (!values.username.startsWith('Riley')) {
                resolve(true)
            } else {
                reject({username: 'That username is taken'})
            }

        }).then((b)=> {
        }).catch((e)=> {
            throw e
        }),
        asyncBlurFields: ['username']
    }
}


@myConnect(Login.reduxPropsConfig, Login.reduxDispatchConfig, Login.reduxFormConfig)
export default class LoginContainer extends Login {
}
