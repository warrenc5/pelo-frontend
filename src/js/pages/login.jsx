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
import { Form, SubmissionError } from 'redux-form'
import { Link } from 'react-router'
import { push } from 'react-router-redux'

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

import submit from "redux-form"
import {debug0,debug2, debugJSON} from '../service/misc'
import ngScope from '../service/bridge'
import { asyncConnect as reduxAsyncConnect } from 'redux-connect'
import { hashHistory,browserHistory } from 'react-router'


function myConnect(reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig, reduxFormConfig) {
    return target => {
        return reduxAsyncConnect(
            reduxAsyncConfig, reduxPropsConfig, reduxDispatchConfig)(reduxForm(reduxFormConfig)(target))
    }
}

class Login extends Component {

    constructor(props) {
        super(props)
        this.props = props
        //this.reduxFormConfig = Login.reduxFormConfig
        this.navigateProgramatically = this.navigateProgramatically.bind(this);
    }

    LoginForm = (props) => {
        const {
            dispatch,
            handleSubmit,
            fbConnect,
            pristine,
            error,
            reset,
            submitting,
            touched,
            asyncValidating,
            submit,
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

                {submitting && <span>Logging you in now..</span>}
                {error && <span>Any Error: {error}</span>}

                <Form onSubmit={handleSubmit(Login.validate)}>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div style={style.root}>
                                    <Field name="username"
                                           component={materialTextField}
                                           label="Username or Email"
                                           asyncValidating={asyncValidating}
                                           onKeyDown={(e) => e.keyCode==13 && e.target.blur()}
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
                                           onKeyDown={(e) => e.keyCode==13 && dispatch(submit(this)) && e.target.blur() }
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
                </Form>
                <Link to="/terms" onClick={this.navigateProgramatically}>Read Terms & Conditions</Link>
            </div>
        )
    }


    componentDidMount() {
        debug2('component did mount')
        //debug0(this.props.route)
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        debug0(router.getCurrentLocation())
    }

    routerWillLeave(nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        //if (!this.state.isSaved)
        return 'Your work is not saved! Are you sure you want to leave?'
    }

    navigateProgramatically(e) {
        e.preventDefault();

        const {dispatch} = this.props
        dispatch(submit())
    }

    componentWillReceiveProps(nextProps) {
        debug2('component will receive props')
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

    static willTransitionTo(transition, params, query, callback) {
        console.log(`transit 2:  ${transition}`)
    }

    static willTransitionFrom(component, transition, params, query, callback) {
        console.log(`transit:  ${transition}`)
    }

    static contextTypes = {
        router: React.PropTypes.func,
        dispatch: React.PropTypes.func
    }

    static validate = (values, dispatch) => {
        if (!['wozza'].includes(values.username)) {
            throw new SubmissionError({username: 'User does not exist', _error: 'Login failed!'})
        } else {
            return new Promise((resolve, reject)=> {
                //resolve({})
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
                dispatch(push('/groups'))
            }).catch((e)=> {
                dispatch({
                    type: `LOGIN_ERROR`,
                    payload: {error: 'there was some error ' + e.message}
                })
                throw new SubmissionError({username: 'User sux', _error: 'Login failed!'})
            })
        }
    }

    static propTypes = {
        fbConnect: PropTypes.func.isRequired,
        ...propTypes
    }

    static reduxAsyncConfig = [{
        key: 'lunch',
        promise: ({ params, helpers }) => Promise.resolve({id: 1, name: 'Borsch'})
    }]
    static reduxPropsConfig = (state, props) => ({
        ok: state.ok,
        initialValues: {
            username: 'wozza', password: 'password'
        } //202
        //initialValues: {username: 'wozza', password: 'password1'} //401
    })

    static reduxDispatchConfig = (dispatch) => ({
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
        asyncValidate: (values, dispatch) => new Promise((resolve, reject)=> {
            const {username, password} = values
            if (password == null || password.length == 0)
                reject({password: 'put a password'})
            else if (!values.username.startsWith('Riley')) {
                resolve(true)
            } else {
                reject({username: 'That username is taken'})
            }
        }).then((b)=> {
            //all is well
        }).catch((e)=> {
            throw e
        }),
        asyncBlurFields: ['username', 'password']
    }
}

@myConnect(Login.reduxAsyncConfig, Login.reduxPropsConfig, Login.reduxDispatchConfig, Login.reduxFormConfig)
export default class LoginContainer extends Login {
}
