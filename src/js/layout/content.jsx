import React from 'react'
import Working from '../component/working.jsx'
import moment from 'moment'
export default class ContentLayout extends React.Component {
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

        return (
            <div>
                <h1>{this.getPageTitle()}</h1>

                <Working/>
                <hr />

                <div>
                    {this.props.children}
                </div>

                now: {moment.format()}
            </div>
        )
    }
}