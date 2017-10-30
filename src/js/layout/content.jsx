import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {createSelector} from 'reselect'
import moment from 'moment'
import connect from 'react-redux'

import Working from '../widget/working.jsx'
//import {buildTime} from '../handler/selectors'
import { RaisedButton, Divider } from 'material-ui'
import {ngScope} from '../service/bridge'
import {debug0,debug2, debugJSON} from '../service/misc'
import { reduxConnect} from '../widget/common'

/*** defunct **/
@reduxConnect()
export default class ContentLayout extends Component {
    constructor(props) {
        super(props)
        console.log('content constructed')
    }

    getPageTitle = () => {
        // let currentPath = this.props.location.pathname

        let pageTitle = this.props.routes[this.props.routes.length - 1].pageTitle

        return pageTitle
    }

    render() {
        //console.log(this.props.children)
        console.log(this.props.routes[this.props.routes.length - 1])
        //console.log(this.props.location.pathname)
        //console.log(this.props.location)
        //now: {moment().format()}

        return (
            <div>
                <h1>{this.getPageTitle()}</h1>
                <Divider/>
                <div>
                    {this.props.children}
                </div>
                <hr/>

                <hr/>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        debug2('content will receive props')
    }


    componentDidMount() {
        debug2('content did mount')
        /**TODO: auto login for testing
         * const {dispatch} = this.props
        dispatch(submit(LoginForm))
        */
    }

    static reduxPropsConfig = (state, props) => {
        return {
            buildTime: buildTimeSelector(state),
            baseUrl: ngScope().state.baseUrl,
            authId: state.login.id
        }
    }

    static propTypes = {
        buildTime: PropTypes.string.isRequired,
        baseUrl: PropTypes.string.isRequired,
        authId: PropTypes.string.isRequired,
    }
}

const buildTimeSelector = createSelector(state => state.globals.buildTime, (result) => (result))
