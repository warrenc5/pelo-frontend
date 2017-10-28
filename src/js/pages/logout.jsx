import React from 'react'
import PropTypes from 'prop-types';
import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'
import { Field, propTypes } from 'redux-form'
import FlatButton from 'material-ui/FlatButton'


@myAsyncFormConnect()
export default class Logout extends MyComponent {

    static NAME = "Logout"

    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return super.isError() ? (<h1>No way</h1>) : (
            <div>
                <span>OK Logout thanks {this.props.login.name} {this.props.signedIn?"NO":"YES"}'</span>

                <FlatButton label="Logout" onClick={this.props.logout()}/>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
         console.log(nextProps)
        /**const {dispatch} = this.props
        dispatch({
            type: `LOGOUT`,
            payload: this.props.login
        })
         **/

    }

    componentDidMount() {

        console.log("Logout")
    }

    static propTypes = {
        signedIn: PropTypes.bool.isRequired,
        login: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    }

    static reduxPropsConfig = (state, props) => ({
        signedIn: state.login != null && state.login.id > 0,
        login: state.login
    })

    static reduxDispatchConfig = (dispatch) => ({
        logout: () => (event) => {
            dispatch({
                type: `LOGOUT_CONFIRM`,
                payload: ''
            })
        }
    })
}