import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {Field, propTypes} from 'redux-form'
import {
    Checkbox,
    RadioButtonGroup,
    SelectField,
    TextField,
    Toggle,
    DatePicker,
} from 'redux-form-material-ui'
import {isEmptyObject} from 'jquery'
import {Form, SubmissionError} from 'redux-form'
import {Link, NavLink, Switch, Route, Redirect} from 'react-router-dom'
import {push} from 'react-router-redux'

import style from '../layout/style'
import * as action from '../handler/actions'
import keydown from 'react-keydown'
import MyComponent, {Catch, myAsyncFormConnect} from '../widget/common'
import {RaisedButton, Divider} from 'material-ui'

import {asyncConnect} from 'redux-connect'
import {
    materialButton,
    materialTextField,
    materialCheckbox,
    materialRadioGroup,
    materialSelectField
} from './material.jsx'

import submit from "redux-form"

import {ngScope} from '../service/bridge'
import {ReduxAsyncConnect} from 'redux-connect'
import {routes} from '../Router.jsx'
import * as select from '../handler/selectors'

@myAsyncFormConnect()
export default class Login extends MyComponent {

    static NAME = "Login"

    constructor(props) {
        super(props)
        this.props = props
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
            hello,
        } = props
        return (
            <div id="loginSection">
                <p id="error">
                    <b>Welcome to the Riders App.</b>
                </p>

                <Field name="loginFB" component={materialButton} onClick={fbConnect()} label="Login with facebook"/>
                <span>.</span>
                <p>Or login locally</p>

                {submitting && <span>Logging you in now..</span>}
                {error && <span>Error: {error}</span>}

                {hello || <span>Can't hello Server</span>}
                <Form onSubmit={handleSubmit(this.validate)}>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div style={style.root}>
                                    <Field name="username"
                                           component={materialTextField}
                                           label="Username or Email"
                                           asyncValidating={asyncValidating}
                                           onKeyDown={(e) => e.keyCode == 13 && e.target.blur()}
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
                                           asyncValidating={asyncValidating}
                                           label="Pasword"
                                           onKeyDown={(e) => e.keyCode == 13 && dispatch(submit(this)) && e.target.blur()}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <Field name="loginButton"
                                           label="LOGIN"
                                           type="submit"
                                           onClick={this.props.handleSubmit(this.validate)}
                                           component={materialButton}
                                           disabled={pristine || submitting}
                                    />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Form>
                <Divider/>
                <NavLink to="/terms">Read Terms & Conditions</NavLink>
            </div>
        )
    }

    render() {
        console.log(this.props)
        const {from} = this.props.location.state || {from: {pathname: this.props.defaultPath}}
        return super.isError() ? <h1>No way</h1> :
            <Catch>
                {this.props.signedIn ? <Redirect to={from}/> : this.LoginForm(this.props)}
            </Catch>
    }

    componentDidMount() {
        console.log('component did mount')
        //console.log(debug0(this.props.route)
        //var {router} = this.props
        //router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        //console.log(debug0(router.getCurrentLocation())

        /**TODO: auto login for testing
         * const {dispatch} = this.props
         dispatch(submit(LoginForm))
         */
    }

    routerWillLeave(nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        //if (!this.state.isSaved)
        return 'Warning. Hard-hat zone.'
    }

    navigateProgramatically(e) {
        e.preventDefault();
        const {dispatch} = this.props
        dispatch(submit(LoginForm))
    }

    componentWillReceiveProps(nextProps) {
        console.log('component will receive props')
        if (!nextProps.hello) {
            alert('rehello')
            this.props.dispatch({
                type: `REASYNC`,
                payload: Login.helloPromise()
            })
        }
    }

    @keydown('enter')
    doSubmit(event) {
        const {dispatch, submit} = this.props
        //FIXME ?? use a variable to trigger submit??
        dispatch(submit('LoginForm'))
    }

    static willTransitionTo(transition, params, query, callback) {
        console.log(`transit 2:  ${transition}`)
    }

    static willTransitionFrom(component, transition, params, query, callback) {
        console.log(`transit:  ${transition}`)
    }

    static contextTypes = {
        dispatch: PropTypes.func
    }

    validate = (values, dispatch, props) => {
        //TODO do this first and if it fails then fail.
        //return Login.reduxFormConfig.asyncValidate(values, dispatch).catch((e)=>())
        return new Promise((resolve, reject) => {
            ngScope().client.login(values.username, values.password, (name, data) => {
                resolve(data)
            }, (e) => {
                reject(e)
            })
        }).then((result) => {
            dispatch({
                type: `LOGIN`,
                payload: result
            })
            //dispatch(push(props.returnPath))
        }).catch((e) => {
            //console.log('>>'+e  + " " + e.stack) //JSON.stringify(e))
            dispatch({
                type: `LOGIN_ERROR`,
                payload: {error: 'there was some error ' + e}
            })
            throw new SubmissionError({_error: 'whoops' + JSON.stringify(e)})
        })
    }

    static propTypes = {
        fbConnect: PropTypes.func.isRequired,
        hello: PropTypes.bool.isRequired,
        defaultPath: PropTypes.string.isRequired,
        returnPath: PropTypes.string.isRequired,
        signedIn: PropTypes.bool.isRequired,
        ...propTypes
    }

    static reduxPropsConfig = (state, props) => ({
        pageTitle: "Login",
        ok: state.ok,
        initialValues: {
            username: 'wozza', password: 'password1', hello: false
        },
        defaultPath: select.defaultPath(state),
        returnPath: location.state !== undefined ? location.state.pathname : select.defaultPath(state),
        signedIn: (select.authIdSelector(state) > 0),
    })


    static reduxDispatchConfig = (dispatch, props) => ({
        fbConnect: () => (event) =>
            new Promise((resolve, reject) => {
                //FIXME --event or event1?
                //event.preventDefault

                //TODO how to preset users email? from cookie??
                var email = 'wozza.xing@gmail.com'

                ngScope().fb.loginFB(email, (response) => {
                        resolve(response)
                    }
                    , (e) => {
                        reject(e)
                    })
            }).then((response) => {
                dispatch({
                    type: `FBLOGIN`,
                    payload: response
                })
                return new Promise((resolve, reject) => {
                    ngScope().client.login2(response.fb.userData.id, response.fb.userData.email, response.fb.auth.accessToken, (name, data) => {
                        resolve(data)
                    }, (e) => {
                        reject(e)
                    })
                }).then((result) => {
                    dispatch({
                        type: `LOGIN`,
                        payload: result
                    })

                    //dispatch(push(props.location.state.pathname))
                }).catch((e) => {
                    console.log(JSON.stringify(e))
                    dispatch({
                        type: `LOGIN_ERROR`,
                        payload: {error: 'there was some error ' + JSON.stringify(e)}
                    })

                    ngScope().fb.showDialog()

                    //throw new SubmissionError({_error: 'whoops' + JSON.stringify(e)})
                })
            }).catch((e) => {
                dispatch({
                    type: `FBLOGIN_ERROR`,
                    payload: {error: 'fb ' + e}
                })
            })
    })

    static helloPromise = ()=>new Promise((resolve, reject) => {
        ngScope().client.sayHello((name, data) => {
            resolve(true)
        }, (e) => {
            reject(e)
        })
    })

    static reduxAsyncConfig =
        [{
            key: 'hello',
            promise: ({params, helpers}) => Login.helloPromise()
        }]


    static reduxFormConfig = {
        form: `LoginForm`,
        asyncValidate: (values, dispatch) => new Promise((resolve, reject) => {
            const {username, password} = values
            console.log("values : " + JSON.stringify(values))
            var error = {}

            if (username == null || username.length == 0)
                error['username'] = 'you must put a username'
            if (password == null || password.length == 0)
                error['password'] = 'you must put a password'
            if (username != null && username.startsWith('bill'))
                error['username'] = 'you win a prize call me now ;)'

            if (isEmptyObject(error))
                resolve(true)
            else {
                console.log("errors : " + JSON.stringify(error))
                reject(error)
            }

        }).then((b) => {
            //all is well
        }).catch((e) => {
            throw e
        }),
        asyncBlurFields: ['username', 'password']
    }

}

