import React, { PropTypes } from 'react'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

export class Working extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    //TODO: show rotating cog
    render () {
        return <span>thinking</span><img src="img/sprocket.gif"/>
    }
}

export default Working
