import React from 'react'
import PropTypes from 'prop-types';

export default class MyComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    reloadOnPropsChange(props, nextProps) {

        console.log('reload on props change ' + props.location.pathName + ' ' + nextProps.location.pathName)
        return props.location.pathname !== nextProps.location.pathname;
    }

    componentDidMount() {
   }


    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
    }

}
