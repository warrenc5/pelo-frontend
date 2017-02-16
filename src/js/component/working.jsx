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
        return <div><span>thinking</span><img src='/img/sprocket.gif'/></div>
    }
}

export default Working
