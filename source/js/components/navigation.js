import React from 'react';
import { Drawer, MenuItem, RaisedButton, List, ListItem, Divider } from 'material-ui';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
  };

  handleToggle = () => {
    this.setState({open: !this.state.open});
  };

  handleWindowResize = () => {
    if (window.innerWidth <= 1300 && this.state.open === true) {
      this.setState({open: false});
    }
    else if (window.innerWidth > 1300 && this.state.open === false) {
      this.setState({open: true});
    }
  };

  componentDidMount = () => {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  };

  render() {
    return (
      <nav className="main-nav">
        <Drawer width={250} open={this.state.open}>
          <div className="main-logo">
            <Link to="/">BIKE<span className="type-italic">weight</span></Link>
          </div>
          <List>
            <ListItem primaryText="Home" containerElement={<Link activeClassName="active" to="/" />} />
            <ListItem primaryText="Bike component"  containerElement={<Link activeClassName="active" to="/bike-component" />}/>
            <ListItem primaryText="Sent mail" />
            <ListItem primaryText="Inbox" />
            <ListItem primaryText="About" containerElement={<Link activeClassName="active" to="/about" />}  />          
          </List>
          <Divider />
          <RaisedButton label="Bike weight" onTouchTap={this.handleToggle} />
        </Drawer>
      </nav>
    )
  }
};