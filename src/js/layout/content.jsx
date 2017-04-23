import React, {Component, PropTypes } from 'react'
import { createSelector } from 'reselect'
import moment from 'moment'
import {connect} from 'react-redux'

import Working from '../component/working.jsx'
//import {buildTime} from '../handler/selectors'
import {ngScope,reduxConnect} from '../service/bridge'


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
                <div>
                    {this.props.children}
                </div>
                <hr/>
                <span>build time {this.props.buildTime}</span><br/>
                <span>server {this.props.baseUrl}</span>
                <hr/>
            </div>
        )
    }


    static reduxPropsConfig = (state, props) => {
        return {
            buildTime: buildTimeSelector(state),
            baseUrl: ngScope().state.baseUrl
        }
    }

    static propTypes = {
        buildTime: PropTypes.func.isRequired,
        baseUrl: PropTypes.string.isRequired,
    }
}

const buildTimeSelector = createSelector(state => state.globals.buildTime, (result) => (result))
