import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Navigation from '../widget/navigation'
import Search from '../widget/search'
import Subheader from 'material-ui/Subheader'
import { RaisedButton, Divider } from 'material-ui'
import HamburgerMenu from 'react-hamburger-menu'

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
                    <div>
                        <HamburgerMenu
                            isOpen={this.props.open}
                            menuClicked={this.handleClick.bind(this)}
                            width={18}
                            height={15}
                            strokeWidth={1}
                            rotate={0}
                            color='black'
                            borderRadius={0}
                            animationDuration={0.5}
                        />
                    </div>
                    <div className="main-content-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

    handleClick(e) {
        if (this.state.open) {
            this.nav.show()
        } else {
            this.nav.hide()
        }
    }

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired
    }
    static defaultProps = {
        visible: false,
        open: false
    }
}


