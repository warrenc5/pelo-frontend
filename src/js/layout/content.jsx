import React, {Component, PropTypes } from 'react'
import Working from '../component/working.jsx'
import moment from 'moment'
import {connect} from 'react-redux'
//import {buildTime} from '../handler/selectors'
import {ngScope} from '../service/bridge'

const config = (
    (state, props) => {
        return {
            buildTime: state.globals.buildTime,
            baseUrl: ngScope().state.baseUrl
        }
    })

function reduxConnect(config) {
    return target => connect(config)(target)
}

@reduxConnect(config)
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
                <hr />
                <span>build time {this.props.buildTime}</span><br/>
                <span>server {this.props.baseUrl}</span>
                <hr/>
            </div>
        )
    }

    static propTypes = {
        buildTime: PropTypes.string.isRequired,
        baseUrl: PropTypes.string.isRequired,
    }
}
