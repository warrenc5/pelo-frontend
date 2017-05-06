import React, { PropTypes } from 'react'

export default class MyComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    reloadOnPropsChange(props, nextProps) {
        console.log('reload on props change')
    }

    componentDidMount() {
    }


    componentWillReceiveProps(nextProps) {
    }


}
