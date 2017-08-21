import React from 'react'
import PropTypes from 'prop-types';


import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

export class Working extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    //TODO: show rotating cog
    render () {
        return <div><span>thinking</span><img src='/img/sprocket1.gif'/></div>
    }
}

export default Working
