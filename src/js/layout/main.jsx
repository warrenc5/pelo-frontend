import React, {Component,PropTypes} from 'react'
import Navigation from '../widget/navigation'
import Search from '../widget/search'
import Subheader from 'material-ui/Subheader';

export default class MainLayout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let currentRouteName = this.props.location.pathname
    return (
      <div>
        <Navigation />
        <div id="main-wrapper" className="main-wrapper">
          <div className="main-content-wrapper">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

MainLayout.propTypes = {
}
