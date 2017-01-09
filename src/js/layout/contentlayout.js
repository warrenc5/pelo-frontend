import React from 'react';

export default class ContentLayout extends React.Component {
  constructor(props) {
    super(props);
      alert('hello cl')
  }

  getPageTitle = () => {
    // let currentPath = this.props.location.pathname;
    
    let pageTitle = this.props.routes[this.props.routes.length-1].pageTitle

    return pageTitle
  }

  render() {
    //console.log(this.props.children)
    console.log(this.props.routes[this.props.routes.length-1])
    //console.log(this.props.location.pathname)
    //console.log(this.props.location)

    return (          
      <div>
        <h1>{this.getPageTitle()}</h1>
        
        <hr />

        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
};