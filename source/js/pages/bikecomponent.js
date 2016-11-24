import React from 'react';

export default class BikeComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (          
      <div>
        <h1>This is bike component page</h1>
        <h2>{this.props.params.componentType}</h2>
      </div>            
    )
  }
};
