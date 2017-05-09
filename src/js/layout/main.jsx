import React, {Component,PropTypes} from 'react'
import Navigation from '../widget/navigation'
import Search from '../widget/search'
import Subheader from 'material-ui/Subheader';
import { RaisedButton, Divider } from 'material-ui'

export default class MainLayout extends Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        let currentRouteName = this.props.location.pathname
        return (
            <div>
                <Navigation ref={(obj) => { this.nav = obj; }} open={this.props.visible}/>
                <div id="main-wrapper" className="main-wrapper">
                    <RaisedButton label='show' onClick={this.func.bind(this)}/>
                    <div className="main-content-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

    func(e) {
        this.nav.show()
    }

    static propTypes = {
        visible: PropTypes.bool.isRequired,
    }
    static defaultProps = {
        visible: true
    }
}


