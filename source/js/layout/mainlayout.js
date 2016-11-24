import React from 'react';
import Navigation from '../components/navigation';
import Search from '../components/search';

export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let currentRouteName = this.props.location.pathname;

    return (          
      <div>
        <Navigation />
        <div id="main-wrapper" className="main-wrapper">
          <Search />
          <div className="main-content-wrapper">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
};