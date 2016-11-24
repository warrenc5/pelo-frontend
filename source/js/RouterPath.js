import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';

import MainLayout from './layout/mainlayout';
import ContentLayout from './layout/contentlayout';
import Home from './pages/home';
import BikeComponent from './pages/bikecomponent';
import About from './pages/about';

let onUpdate = () => {
  window.scrollTo(0, 0); 
};

export default class RouterPath extends React.Component {
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/" component={MainLayout}>
            <IndexRoute component={Home} />
            <Route component={ContentLayout}>
              <Route path="/bike-component" component={BikeComponent} pageTitle="Bike component page" />
              <Route path="/bike-component/:componentType" component={BikeComponent} pageTitle="{:componentType}"/>            
            </Route>
            <Route path="/about" component={About} />
          </Route>
        </Router>
      </div>
    );
  }
}
